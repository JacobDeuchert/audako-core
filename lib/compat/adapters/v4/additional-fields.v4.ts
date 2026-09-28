import { ApiVersionInfo } from '../../../api/api-version.js';
import { GeoPosition } from '../../../models/entities/group.model.js';
import { ScalingCalculatorState } from '../../../models/entities/signal.model.js';
import { EntityAdapter } from '../entity-adapter.js';

/**
 * v4 keeps a number of application-owned values as strings in `AdditionalFields`; v5 promoted
 * them to typed properties and migrates stored data once (platform ticket #3482,
 * `Services/Structure/Structure/Migration/*Migrator_V1.cs`). This module maps one legacy key to one
 * property of the same entity, following the migrator parsers so that a v4 read yields the value
 * the v5 migration would have produced:
 *
 * - read:  a convertible key is removed from the map and written to the property, keeping its
 *          `OOAttributes`. An unconvertible value stays in the map and the property keeps its
 *          model default - the migrator does the same, so nothing is lost.
 * - write: the property is removed from the payload and written back as the legacy string, merged
 *          into the map (other keys are untouched). A `null` value removes the key, unless the
 *          stored value is one the read left in the map as unconvertible.
 *
 * Keys whose v5 target lives on another entity (`Dashboard.Tabs`, `Dashboard.StartDashboard`) or
 * cannot be resolved from the entity alone (`CreatedWithManager`) are not mapped here.
 */

/**
 * Converts one legacy string. `parse` returns `undefined` when the value cannot be represented, and
 * `{ value }` otherwise; blank values parse to `{ value: null }`. `format` returns `null` when the
 * key should be absent.
 */
export interface LegacyKeyCodec<T> {
  parse(raw: string | null): { value: T | null } | undefined;
  format(value: T | null | undefined): string | null;
}

/** One legacy `AdditionalFields` key and the `Field<T>` property it maps to. */
export interface PromotedKey {
  key: string;
  /** Property path relative to the entity, e.g. `['Icon']` or `['Settings', 'EnforceMonotonicInput']`. */
  path: string[];
  codec: LegacyKeyCodec<any>;
}

export const ICON_MAX_LENGTH = 64;
export const BLOCKLY_XML_MAX_LENGTH = 1024 * 1024;

function isBlank(raw: string | null): boolean {
  return raw === null || raw.trim().length === 0;
}

function isNullLiteral(raw: string | null): boolean {
  return isBlank(raw) || raw!.trim().toLowerCase() === 'null';
}

/** Plain string with an optional maximum length. */
export function textCodec(maxLength?: number): LegacyKeyCodec<string> {
  return {
    parse: (raw) => {
      if (isBlank(raw)) {
        return { value: null };
      }
      return maxLength !== undefined && raw!.length > maxLength ? undefined : { value: raw };
    },
    format: (value) => (value === null || value === undefined || value === '' ? null : String(value)),
  };
}

/** Entity id; the UI occasionally stored the literal `"null"`. */
export const idCodec: LegacyKeyCodec<string> = {
  parse: (raw) => (isNullLiteral(raw) ? { value: null } : { value: raw!.trim() }),
  format: (value) => (value === null || value === undefined || value === '' ? null : value),
};

/** `"true"` / `"false"`, case-insensitive. Anything else, including blank, is unconvertible. */
export const boolCodec: LegacyKeyCodec<boolean> = {
  parse: (raw) => {
    const trimmed = (raw ?? '').trim().toLowerCase();
    if (trimmed === 'true') {
      return { value: true };
    }
    return trimmed === 'false' ? { value: false } : undefined;
  },
  format: (value) => (value === null || value === undefined ? null : String(!!value)),
};

/** Integer, blank means unordered. */
export const nullableIntCodec: LegacyKeyCodec<number> = {
  parse: (raw) => {
    if (isBlank(raw)) {
      return { value: null };
    }
    const trimmed = raw!.trim();
    return /^[+-]?\d+$/.test(trimmed) ? { value: parseInt(trimmed, 10) } : undefined;
  },
  format: (value) => (value === null || value === undefined ? null : String(value)),
};

/** `#RRGGBB` / `#RRGGBBAA`, normalized to lower case like the migrator. */
export const hexColorCodec: LegacyKeyCodec<string> = {
  parse: (raw) => {
    if (isBlank(raw)) {
      return { value: null };
    }
    const normalized = raw!.trim().toLowerCase();
    return /^#([0-9a-f]{6}|[0-9a-f]{8})$/.test(normalized) ? { value: normalized } : undefined;
  },
  format: (value) => (value === null || value === undefined || value === '' ? null : value),
};

function parseJsonObject(raw: string | null): { value: any } | undefined {
  if (isNullLiteral(raw)) {
    return { value: null };
  }
  try {
    const parsed = JSON.parse(raw!);
    return parsed === null || (typeof parsed === 'object' && !Array.isArray(parsed)) ? { value: parsed } : undefined;
  } catch {
    return undefined;
  }
}

/** Case-insensitive property read; `names` are tried in order. `null` values count as absent. */
function readProperty(source: any, names: string[]): any {
  const lowered = names.map((name) => name.toLowerCase());
  for (const key of Object.keys(source)) {
    if (lowered.indexOf(key.toLowerCase()) >= 0 && source[key] !== null && source[key] !== undefined) {
      return source[key];
    }
  }
  return undefined;
}

function toNumber(value: any): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * `Group.Position`: the UI stored a Leaflet `{"lat","lng"}` JSON string. Half-filled or out of
 * range coordinates are unconvertible; an object with neither coordinate is no position.
 */
export const positionCodec: LegacyKeyCodec<GeoPosition> = {
  parse: (raw) => {
    const json = parseJsonObject(raw);
    if (!json || json.value === null) {
      return json;
    }
    const latitude = toNumber(readProperty(json.value, ['lat', 'latitude']));
    const longitude = toNumber(readProperty(json.value, ['lng', 'longitude']));
    if (latitude === null && longitude === null) {
      return { value: null };
    }
    if (latitude === null || longitude === null) {
      return undefined;
    }
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return undefined;
    }
    return { value: { Latitude: latitude, Longitude: longitude } };
  },
  format: (value) =>
    value === null || value === undefined ? null : JSON.stringify({ lat: value.Latitude, lng: value.Longitude }),
};

const SCALING_NUMBER_KEYS = [
  'RealValueFrom',
  'RealValueTo',
  'TargetFrom',
  'TargetTo',
  'ReadingFrom',
  'ReadingTo',
  'CheckResult',
] as const;

function toText(value: any): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  return typeof value === 'object' ? null : String(value);
}

/** Legacy form control name: the UI wrote `deviceTypeControl` for `DeviceType`. */
function controlName(property: string): string {
  return property.charAt(0).toLowerCase() + property.slice(1) + 'Control';
}

/**
 * `SignalAnalogSettings.ScalingCalculatorState`: the UI wrote its form value as JSON, with a
 * `Control` suffix on every key. Both spellings are read. `readingLengthControl` is derived
 * (`ReadingTo - ReadingFrom`), so it is dropped on read and recomputed on write.
 */
export const scalingCalculatorStateCodec: LegacyKeyCodec<ScalingCalculatorState> = {
  parse: (raw) => {
    const json = parseJsonObject(raw);
    if (!json || json.value === null) {
      return json;
    }
    const read = (property: string) => readProperty(json.value, [property, property + 'Control']);
    const state = new ScalingCalculatorState();
    state.DeviceType = toText(read('DeviceType'));
    for (const key of SCALING_NUMBER_KEYS) {
      state[key] = toNumber(read(key));
    }
    state.ReadingUnit = toText(read('ReadingUnit'));
    return { value: state };
  },
  format: (value) => {
    if (value === null || value === undefined) {
      return null;
    }
    const readingLength =
      typeof value.ReadingFrom === 'number' && typeof value.ReadingTo === 'number'
        ? value.ReadingTo - value.ReadingFrom
        : null;
    // Key order of the UI form group.
    return JSON.stringify({
      [controlName('DeviceType')]: value.DeviceType ?? null,
      [controlName('RealValueFrom')]: value.RealValueFrom ?? null,
      [controlName('RealValueTo')]: value.RealValueTo ?? null,
      [controlName('TargetFrom')]: value.TargetFrom ?? null,
      [controlName('TargetTo')]: value.TargetTo ?? null,
      [controlName('ReadingUnit')]: value.ReadingUnit ?? null,
      [controlName('ReadingFrom')]: value.ReadingFrom ?? null,
      [controlName('ReadingTo')]: value.ReadingTo ?? null,
      readingLengthControl: readingLength,
      [controlName('CheckResult')]: value.CheckResult ?? null,
    });
  },
};

/** Raw string and OO attributes of a map entry; tolerates a bare string instead of a `Field`. */
function readLegacyField(entry: any): { raw: string | null; ooAttributes: any[] } {
  if (typeof entry === 'string') {
    return { raw: entry, ooAttributes: [] };
  }
  if (entry && typeof entry === 'object') {
    return {
      raw: typeof entry.Value === 'string' ? entry.Value : null,
      ooAttributes: Array.isArray(entry.OOAttributes) ? entry.OOAttributes : [],
    };
  }
  return { raw: null, ooAttributes: [] };
}

function getPath(entity: any, path: string[]): any {
  let current = entity;
  for (const part of path) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

/**
 * Copy of `entity` with `value` at `path`; `undefined` deletes the leaf. Intermediate objects are
 * copied, never mutated. Returns `entity` unchanged when an intermediate object is missing.
 */
function setPath(entity: any, path: string[], value: any): any {
  const [head, ...rest] = path;
  if (rest.length === 0) {
    const copy = { ...entity };
    if (value === undefined) {
      delete copy[head];
    } else {
      copy[head] = value;
    }
    return copy;
  }
  const child = entity[head];
  if (!child || typeof child !== 'object') {
    return entity;
  }
  return { ...entity, [head]: setPath(child, rest, value) };
}

/** Wire -> canonical: moves every convertible legacy key onto its property. */
export function promoteAdditionalFields(entity: any, keys: PromotedKey[]): any {
  const map = entity && entity.AdditionalFields;
  if (!map || typeof map !== 'object' || Array.isArray(map)) {
    return entity;
  }

  let result = entity;
  let remaining: any = map;
  for (const { key, path, codec } of keys) {
    if (!(key in remaining)) {
      continue;
    }
    const { raw, ooAttributes } = readLegacyField(remaining[key]);
    const parsed = codec.parse(raw);
    if (!parsed) {
      continue;
    }
    const target = setPath(result, path, { Value: parsed.value, OOAttributes: ooAttributes });
    if (target === result) {
      // No parent object to write to (e.g. a signal without `Settings`): keep the key.
      continue;
    }
    result = target;
    if (remaining === map) {
      remaining = { ...map };
    }
    delete remaining[key];
  }

  return remaining === map ? result : { ...result, AdditionalFields: remaining };
}

/** Canonical -> wire: writes every present property back into the map as its legacy string. */
export function demoteAdditionalFields(entity: any, keys: PromotedKey[]): any {
  let result = entity;
  let map: any = entity.AdditionalFields && typeof entity.AdditionalFields === 'object' ? entity.AdditionalFields : {};
  let changed = false;

  for (const { key, path, codec } of keys) {
    const field = getPath(result, path);
    if (field === undefined) {
      continue;
    }
    result = setPath(result, path, undefined);

    const value = field && typeof field === 'object' && 'Value' in field ? field.Value : null;
    const formatted = codec.format(value);
    if (formatted === null) {
      // Keep a value the read left behind as unconvertible: dropping it would lose data nobody
      // was able to see through the typed property.
      if (key in map && codec.parse(readLegacyField(map[key]).raw) !== undefined) {
        map = changed ? map : { ...map };
        delete map[key];
        changed = true;
      }
      continue;
    }

    const ooAttributes = field && Array.isArray(field.OOAttributes) ? field.OOAttributes : [];
    map = changed ? map : { ...map };
    map[key] = { Value: formatted, OOAttributes: ooAttributes };
    changed = true;
  }

  return changed ? { ...result, AdditionalFields: map } : result;
}

/**
 * v4 adapter for entities whose only difference is a set of promoted keys. Identity on v5.
 * `keysFor` may depend on the entity (e.g. the signal's settings type).
 */
export function additionalFieldsAdapterV4<T>(keysFor: (entity: any) => PromotedKey[]): EntityAdapter<T> {
  return {
    fromWire(wire: any, ctx: ApiVersionInfo): T {
      if (!wire || typeof wire !== 'object' || !ctx.isV4) {
        return wire;
      }
      return promoteAdditionalFields(wire, keysFor(wire)) as T;
    },

    toWire(entity: any, ctx: ApiVersionInfo): any {
      if (!entity || typeof entity !== 'object' || !ctx.isV4) {
        return entity;
      }
      return demoteAdditionalFields(entity, keysFor(entity));
    },
  };
}

/** `Synchronized: "true"` - v4's flag for entities that came from a synchronization partner. */
export const SYNCHRONIZED_KEY = 'Synchronized';
/** The partner is not recorded on v4; same sentinel the v5 migrator writes. */
export const UNKNOWN_SYNCHRONIZATION_PARTNER = 'unknown';

/**
 * Shared v4 read pass for every entity type: `Synchronized: "true"` becomes
 * `SynchronizedFrom: "unknown"`. Other values stay in the map.
 */
export function synchronizedFromWireV4(entity: any): any {
  const map = entity && entity.AdditionalFields;
  if (!map || typeof map !== 'object' || !(SYNCHRONIZED_KEY in map)) {
    return entity;
  }
  const parsed = boolCodec.parse(readLegacyField(map[SYNCHRONIZED_KEY]).raw);
  if (!parsed || parsed.value !== true) {
    return entity;
  }
  const { [SYNCHRONIZED_KEY]: _flag, ...remaining } = map;
  return { ...entity, AdditionalFields: remaining, SynchronizedFrom: UNKNOWN_SYNCHRONIZATION_PARTNER };
}

/**
 * Shared v4 write pass: restores the `Synchronized` flag the read pass took out of the map, since
 * a v4 `PUT` replaces the whole map. `SynchronizedFrom` itself is server-owned and stripped by
 * `baseToWire`.
 */
export function synchronizedToWireV4(entity: any): any {
  if (!entity || typeof entity !== 'object' || !entity.SynchronizedFrom) {
    return entity;
  }
  const map = entity.AdditionalFields && typeof entity.AdditionalFields === 'object' ? entity.AdditionalFields : {};
  if (SYNCHRONIZED_KEY in map) {
    return entity;
  }
  return { ...entity, AdditionalFields: { ...map, [SYNCHRONIZED_KEY]: { Value: 'true', OOAttributes: [] } } };
}

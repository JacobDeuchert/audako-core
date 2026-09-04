import { ApiVersion } from '../../api/api-version.js';
import { UnsupportedApiVersionError } from '../../api/errors.js';
import { EntityType } from '../../models/entities/configuration-entity.model.js';
import { HttpConfig } from '../../models/http-config.model.js';
import { V4_ENDPOINTS } from './endpoints.v4.js';
import { V5_ENDPOINTS } from './endpoints.v5.js';

/**
 * Per-service base URLs, always built as `Services.BaseUri + Services.<Service>` so the
 * partially migrated v5 config (`Structure: '/v1/structure'`, but `Live: '/live'`) keeps working.
 * Never hardcode `/api/v1` (docs/analysis/v4-to-v5-endpoints.md section 5).
 */
export interface ServiceUrls {
  /** `Services.BaseUri`, e.g. `https://host/api`. */
  base: string;
  structure: string;
  historian: string;
  driver: string;
  live: string;
}

/** Builds the per-service base URLs from an `HttpConfig`. */
export function getServiceUrls(httpConfig: HttpConfig): ServiceUrls {
  const services = httpConfig?.Services;
  const base = services?.BaseUri || '';
  return {
    base: base,
    structure: `${base}${services?.Structure || ''}`,
    historian: `${base}${services?.Historian || ''}`,
    driver: `${base}${services?.Driver || ''}`,
    live: `${base}${services?.Live || ''}`,
  };
}

/** Parameters each endpoint needs. Keys are the endpoint names. */
export interface EndpointParams {
  /** `GET {structure}/about/version` - anonymous, bare string body. */
  version: {};
  /** Entity collection root. `POST` to add, and on v5 the `QUERY` target. */
  entityCollection: { entityType: EntityType };
  /** Single entity by id (GET / PUT / DELETE). */
  entityById: { entityType: EntityType; id: string };
  /** Entity query. v4: `POST {root}/query`. v5: `QUERY {root}`. */
  entityQuery: { entityType: EntityType };
  /** v5 only: `GET {root}/count?$filter=`. */
  entityCount: { entityType: EntityType };
  /** v5 only: `GET {root}/entity-info`. */
  entityInfo: { entityType: EntityType };
  /** Copy one entity into a group (mutating GET). */
  entityCopy: { entityType: EntityType; sourceId: string; targetId: string };
  /** Copy many entities into a group (PUT, body `string[]`). */
  entityCopyMultiple: { entityType: EntityType; targetId: string };
  /** Move one entity into a group (mutating GET). */
  entityMove: { entityType: EntityType; sourceId: string; targetId: string };
  /** Move many entities into a group (PUT, body `string[]`). */
  entityMoveMultiple: { entityType: EntityType; targetId: string };
  /** Multipart process image upload, form field `file`. */
  processImageUpload: { id: string };
  tenantViewById: { tenantId: string };
  tenantViewForEntity: { entityId: string };
  tenantsTop: {};
  tenantsNext: { tenantId: string };
  tenantsFilter: { filter: string };
  /** `GET` / `PUT {structure}/user-profile`. */
  userProfile: {};
  /** Flat-row historical value query. */
  historicalValuesQueryManyFlat: {};
  /** Packaged historical value query. */
  historicalValuesQueryMany: {};
  historicalValuesNearest: {};
  historicalValuesNth: {};
  historicalValuesManual: {};
  historicalValuesNotes: {};
  /** `GET .../offsets?$from=&$till=`. */
  counterOffsets: { signalId: string };
  /** `POST .../offsets/custom`. v5 requires a PascalCase body. */
  counterOffsetsCustom: { signalId: string };
  /** `POST .../offsets/remove`. */
  counterOffsetsRemove: { signalId: string };
  /** `POST .../offsets/custom/remove`. */
  counterOffsetsCustomRemove: { signalId: string };
  statisticsReset: { signalId: string };
  historicalValueImport: {};
  historicalValueOperations: { signalId: string };
  historicalValueOperationStart: { signalId: string };
  historicalValueOperationUndo: { operationId: string };
  historicalValueOperationRedo: { operationId: string };
  /** `GET {driver}/command/source/{id}/configure`. */
  driverConfigureDataSource: { dataSourceId: string };
  /** `POST {driver}/command/conn/{id}/browse`. */
  driverBrowseConnection: { dataConnectionId: string };
  /** SignalR hub URL. v4: `{live}/hub`. v5: `{live}/values`. */
  liveHub: {};
}

/** Every endpoint audako-core can address. */
export type EndpointName = keyof EndpointParams;

/** A named endpoint plus its parameters. */
export type Endpoint = {
  [K in EndpointName]: { name: K } & EndpointParams[K];
}[EndpointName];

/** A resolved endpoint: absolute URL plus the HTTP method (or `'HUB'` for the SignalR hub). */
export interface ResolvedEndpoint {
  url: string;
  method: string;
}

/** Builder for a single endpoint. `null` marks an endpoint that does not exist on that version. */
export type EndpointBuilder<K extends EndpointName> =
  ((urls: ServiceUrls, params: EndpointParams[K]) => ResolvedEndpoint) | null;

/** Full endpoint table of one API version. */
export type EndpointTable = { [K in EndpointName]: EndpointBuilder<K> };

/**
 * Resolves an endpoint against the target system's config and API version.
 *
 * @throws UnsupportedApiVersionError when the endpoint does not exist on that API version
 *         (e.g. `entityCount` / `entityInfo` on v4 - gate those with `supports('entityCount')`).
 */
export function resolveEndpoint(httpConfig: HttpConfig, apiVersion: ApiVersion, endpoint: Endpoint): ResolvedEndpoint {
  const table: EndpointTable = apiVersion === 'V5' ? V5_ENDPOINTS : V4_ENDPOINTS;
  const builder = table[endpoint.name] as EndpointBuilder<EndpointName>;

  if (!builder) {
    throw new UnsupportedApiVersionError(
      apiVersion,
      `Endpoint "${endpoint.name}" does not exist on audako platform ${apiVersion}.`,
    );
  }

  return builder(getServiceUrls(httpConfig), endpoint as any);
}

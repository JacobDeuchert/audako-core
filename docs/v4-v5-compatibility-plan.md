# audako-core: v4 / v5 platform compatibility plan

Status: rollout steps 1 and 2 implemented on branch `feat/v4-v5-compat` (`ApiContext`, version
helper, compatibility check, endpoint resolver, and the v4 adapters for the entities that differ,
with fixture tests). Steps 3 and 4 (migrating the apps, deprecation logging against a live v5
system) are open, as are the open items below. App-facing summary: `docs/migration-2.0.md`.
Last updated 2026-09-04.

## Goal

Apps built on audako-core must run unchanged against audako platform v4 (4.12–4.23)
and v5 (5.0+) during the transition. Version handling lives in audako-core, not in the
apps. Apps see one set of models and services and never branch on the platform version
themselves.

## Version window

| Line | Range | Notes |
|---|---|---|
| v4 | 4.12 – 4.23 | 4.23 is the final v4 release. Later v4 changes are hotfixes only; API and models are frozen. |
| v5 | 5.0+ | Moving target. Platform repo commits to additive-only model changes within the major. |

- Below 4.12: blocked.
- 4.x above 4.23: cannot exist, treated as an error.
- 5.x newer than core knows: warn and continue (additive rule).
- Unknown major (6+): block.
- Apps may declare a higher minimum on the 5.x line for features they need, and may
  declare that they do not support v4 at all.

## Decisions

1. **Runtime detection, not build-time.** Apps pick the target system at runtime
   (`requestHttpConfig(systemUrl)`), so one build must talk to both versions. No separate
   npm packages or `audako-core/v4` subpath exports.
2. **Canonical models follow v5.** `lib/models` is shaped like the newest platform. v4 is
   mapped at the wire boundary by adapters. Apps never see two shapes of the same entity.
3. **Adapters only where something differs.** Default is identity. One adapter per entity
   type that differs, applied in the http services where payloads enter and leave. The
   ad-hoc `delete entity.CreatedBy` in `updateEntity` is the first thing to move there.
4. **Per-version endpoint resolver.** URL differences (`/api/live/...` vs
   `/api/v1/live/...`, resource renames such as `value` -> `historical-values/query`, hub
   `hub` -> `values`) are resolved in one place. Do not rely on v5's legacy URL rewriter;
   it is temporary.
5. **Feature flags over version comparisons.** Apps ask `supports(feature)`; the mapping
   from version to capability lives in core.
6. **Fail fast at connect time.** Version detection and compatibility check run before the
   first real request and produce a structured result the app can show to the user.
7. **Renames and moves are expensive** because `$filter`, `$projection` and sort keys are
   field names sent to the server. Avoid them; where unavoidable, adapt GET/PUT and document
   that query keys use canonical names only.
8. **One `ApiContext` constructor argument** replaces the separate `httpConfig` and
   `accessToken` arguments. This is the breaking change that justifies a major bump.
9. **Raising the minimum deletes code.** Every raise removes the adapters and optional
   fields below it in the same change. v4 end of life is one deletion of `lib/compat/*v4*`
   plus one branch in the compatibility check.

## Model change handling

| Change type | Handling |
|---|---|
| Additive optional field | Model gets optional field. No adapter. Apps treat as possibly undefined or check `supports(feature)`. |
| Rename / move | Adapter both directions for GET/PUT. Query keys not rewritten (see decision 7). |
| Removed in newer version | Kept optional and deprecated in model; adapter drops on write to newer system. Deleted with the minimum raise. |
| Semantic change (enum values, units, defaults) | Adapter normalizes to canonical meaning, with a comment describing the old meaning. |
| Structural (split/merge) | Usually not adapted. Feature-gated instead. |

## Version helper (public API)

- `ApiVersionInfo`: `apiVersion: 'V4' | 'V5'`, `platformVersion: string` (exact semver),
  `supports(feature)`, `isAtLeast(version)`.
- `detectApiVersion(apiUrl)`: probes `/api/v1/structure/about/version`, then the legacy path.
  `isApiReachable(apiUrl)` shares the probe. Explicit override for tests and proxied systems.
- `checkCompatibility(requirements)`: returns `ok | tooOld | unknownMajor | unsupportedMajor`
  plus detected and required versions. `assertCompatible(requirements)` throws a typed error.
- Requirements come from two layers: core's own supported window, and the app's own minimum
  on top.
- Deprecation logger: log once per path when v5 answers with `Deprecation: true`. Gives a
  live list of calls still on legacy paths.

## Project structure

```
lib/
  models/                     canonical models (v5 shape), unchanged location
  services/                   public services, version-agnostic
  api/                        runtime version context (public)
    api-context.ts            HttpConfig + accessToken + ApiVersionInfo
    api-version.ts            ApiVersion, ApiVersionInfo, semver helpers
    version-detection.ts      detectApiVersion
    compatibility.ts          checkCompatibility / assertCompatible
    features.ts               feature flag -> version predicate
    errors.ts                 UnsupportedApiVersionError, IncompatibleBackendError
  compat/                     everything version-specific (not exported)
    endpoints/
      endpoint-resolver.ts
      endpoints.v4.ts
      endpoints.v5.ts
    adapters/
      entity-adapter.ts       interface, identity default, shared base passes
      index.ts                frozen entity type -> adapter map, applyFromWire / applyToWire
      v4/                     one file per entity that differs
      live.adapter.v4.ts
      historical-value.adapter.v4.ts
    deprecation-logger.ts
  utils/, interfaces/         unchanged
test/
  fixtures/v4/, fixtures/v5/  JSON captured from real systems, per entity
  compat/                     adapter round-trip tests
  api/                        detection and compatibility tests
```

`index.ts` exports `api/` but nothing from `compat/`.

## Analysis results (2026-09-02)

Detailed reports live in `docs/analysis/`. Method for the v4 side: neither structuremodels
nor the services carry version tags and services reference the models package with wildcard
versions, so release boundaries were derived from the `Release 4.x.YYYYMMDD` commits in the
structure service repo. A models commit is attributed to the first release whose first build
came after it; hotfix builds of the previous release may also carry it.

| Release | First build | structuremodels baseline |
|---|---|---|
| 4.12 | 2023-10-11 | 33b1973 |
| 4.13 | 2023-12-19 | 70934ed |
| 4.14 | 2024-04-16 | 63da416 |
| 4.15 | 2024-07-15 | 6d1f906 |
| 4.16 | 2024-10-18 | 668d56f |
| 4.17 / 4.18 | 2025-01-21 / 2025-03-04 | 19e8882 (no model changes between) |
| 4.19 | 2025-06-04 | 2ebe925 |
| 4.20 | 2025-09-08 | 3a49e8c |
| 4.21 | 2025-11-04 | 4ec211d |
| 4.22 | 2026-04-09 | 71e26b0 |
| 4.23 | 2026-06-22 | 989b4b4 (master HEAD, final v4) |

### v4 window 4.12 -> 4.23: models

Verdict: the window is one adapter set, not several. audako-core already models the 4.23
shape, and nearly every change is additive. Real handling is needed for exactly these,
all keyed on the exact 4.x minor:

| Since | Entity | Change | Handling |
|---|---|---|---|
| 4.13 | EventDefinition | `ExpressionParameters[].Type` values rewritten by migrator to `*Settings` names (two irregular: `DataSourceFailureCondition -> ConnectionFailureConditionSettings`, `DataConnectionFailureCondition -> DataConnectionFailure`) | Value map on 4.12 only. Core enum already has the new names. |
| 4.13 | RuntimeScript | `Enabled` added, absent docs read as disabled | Treat undefined as true on 4.12 reads. |
| 4.15 | DashboardTab | `DashboardTabEntity.Id -> EntityId` renamed inside the window; short-lived `EntityMapping` (string dict) vs final `EntityMappings` (object dict) | Read both spellings, write `EntityId`. Do not map `EntityMapping` onto `EntityMappings`. |
| 4.16 | TranslatableField | `Translations` first appears on the wire | Feature flag `translations`; below 4.16 translations are unsupported, not empty. |
| 4.16 | TenantView | `PublicTenantView` collapsed into `TenantView` (superset), `IncludesSelf` added | Optional `IncludesSelf` and `Position` in the model, undefined below 4.16. |
| 4.17 | EventDefinition | `EventCategoryId` arrives as bare `null` instead of `{Value:null}` | Coerce null to empty Field on read below 4.17. |
| 4.17 | BatchDefinition | `MetadataField.Editable` added; migrator derives it from `ObligatoryAt == Stop` | Below 4.17 derive the same way on read. |
| 4.23 | EventCategory | `Acknowledgment -> RequiresAcknowledgment` rename, no server migrator | Read either, write legacy name below 4.23. |

Everything else (Tags, Alias, MaintenanceMode, MeterBus, OneWire, Mqtt, PermaLiveMode,
BatchReviewSettings, ReleaseSettings, AlarmOn, DefaultStepSize, InactivityTimeout, ...) is
additive: undefined on older servers, silently dropped on write to older servers. Where a
write would lose data (for example `EntityMappings` against 4.13), expose a feature flag
rather than an adapter. Genuine structural breaks in the window (EmailMessageSettings ->
SpecificSettings in 4.20, message line secret obfuscation `"***"` in 4.21, Manifest
renames) are all on types core does not model.

Server-side defaults differ from core constructor defaults in a few places
(`OpcUaSettings.TimestampSource`, `PollingInterval`, `PermaLiveModeSettings`, MeterBus
settings, `NoRepeatUntilAcknowledged`, `FormulaVariable.TagScope`): the server returns
`null` where core defaults a value. Treat present-but-null as absent.

### 4.23 -> 5.0: models

Verdict: barely diverged, and with Storage dropped from core there is no hard break left. Naming policy (PascalCase), string enums, `_t` discriminators,
`Field<T>` and `TranslatableField<T>` are identical. For 27 of the ~29 entity types core
models the wire shape is unchanged. Differences:

| Entity | Change | Handling |
|---|---|---|
| Storage | Removed as ConfigurationEntity in v5; replaced by service-local `DashboardTabStorage` with different fields and endpoints | **Decision (2026-09-02): drop Storage from audako-core entirely.** Remove `storage.model.ts`, `EntityType.Storage`, its v4 endpoint path and the `EntityTypeClassMapping` entry in the major bump. No adapter. Apps that need dashboard tab storage on v5 get a dedicated service later if demand exists. |
| All entities, query responses | v5 serializes typed objects: every property present (null instead of absent), unknown stored fields dropped, inexpressible projections silently ignored (v4 could 500) | Never branch on key presence. Shared fill-defaults pass in `fromWire`. |
| All entities, writes | `Path`, `AclAllow`, `AclDeny`, `ManagedBy`, `SynchronizedFrom` are server-owned | Shared `toWire` strips them (harmless on v4 too). |
| Group, Dashboard, Role, Signal, Formula, EventDefinition, EventCategory, SwitchSchedule, SwitchOperation, RecipientGroup (platform #3482, 2026-09-25) | Application-owned `AdditionalFields` keys promoted to typed properties; v5 migrates stored data once and ignores the keys afterwards. v4 still stores them as strings in the map | Canonical models carry the typed properties. v4 adapters (`lib/compat/adapters/v4/additional-fields.v4.ts`) map key <-> property with the migrator's parsers, unconvertible values stay in the map. `Synchronized` -> `SynchronizedFrom: "unknown"` is a shared v4 pass. |
| DashboardTab, Group, all entities (platform #3482) | `DashboardTab.Order`, `Group.StartDashboardId`, `ManagedBy` replace data held on *other* entities in v4 (`Dashboard.AdditionalFields.Tabs` / `StartDashboard`) or not recorded (`CreatedWithManager` flag) | Optional in the model, undefined on v4; features `dashboardTabOrder`, `entryPointStartDashboard`, `managedBy`. Tab reorder and start-dashboard resolution need service methods (open). |
| EventCategory | `Acknowledgment: Field<bool>` added next to `RequiresAcknowledgment` | Add to canonical model; strip on v4 `toWire`. |
| AuditLog | `OperationId`, `RestoreEntryPoint`, `IsInternal` added | None, not modelled. |
| Removed | `SearchEntry` (full-text search), `FormulaTemplate`, `TenantManagement` ACL constant | Not modelled. Feature-gate if ever needed. |
| In flux (unmerged PR) | VoIP: `VoipSystemSettings`, `VoipMessageSettings` additions, polymorphic `MessageTemplate` | Do not model yet. |

### 4.23 -> 5.0: endpoints

Verdict: mostly URL edits plus a few contract changes. Full table in
`docs/analysis/v4-to-v5-endpoints.md`. Important points:

- **HttpConfig.** `Services.BaseUri` still ends in `/api`; the `v1` moved into the per-service
  path (`Structure: "/v1/structure"`). Migration is per service and partial: Live, Maintenance,
  Messenger, Runtime, ExternalApi are still on bare v4 paths at HEAD. Core must keep reading
  per-service paths from config and never hardcode `/api/v1`. `http-config.model.ts` lacks
  `Driver` (already used at runtime) and the new keys.
- **Entity routes.** Domain prefixes (`/base/`, `/daq/`, ...) are gone; each entity is a
  kebab-plural segment under `/api/v1/structure/` (`groups`, `signals`, `dashboard-tabs`,
  `event-categories`, ...). Segment map in the analysis doc.
- **Query is the big one.** `POST {entity}/query` becomes the `QUERY` HTTP verb on the
  collection root. `$projection` moves from body to query string. New optional `$sort` and
  `Language` header. `Paging-Headers` unchanged. The legacy rewrite for `/query` is dead
  (405). Must verify browser XHR/fetch and axios accept the `QUERY` verb before relying on it.
- **updateEntity.** Stop deleting `CreatedBy`/`CreatedOn` (server restores them).
  `ChangedOn` is now an optimistic-concurrency token and must be round-tripped from the GET.
  New 423 Locked and 400 on Id mismatch.
- **copyMultipleTo / moveMultipleTo.** Response is JSON `{OperationId}` instead of text.
- **Historian.** Paths move under `historical-values/`, `historical-value-imports`,
  `historical-value-operations`. `MinMaxInterval` dropped from queries. `getNearestValue`
  returns a full `MeasuredValue`. `HistoricalValueOperation` model changed substantially
  (`UserId`/`StartedOn`/`StoppedOn` replace `CreatedOn`/`CreatedBy`/...; `Status` narrows to
  `Pending|Completed|Failed`). `setCustomOffset` body must be PascalCase. `setCustomOffset`
  and `deleteCustomOffsets` have no working legacy rewrite and 404 today.
- **Live hub.** URL becomes `/api/v1/live/values`. Method names, `Send` event and all five
  prefixes unchanged. SignalR payloads stay camelCase. `SubscribeMany` silently drops
  ACL-denied ids; un-prefixed ids are denied. `ChangeIntervalAsync` clamped to 250 ms.
- **Driver.** `configureDataSource` (was `sendDatSrcConfiguration`) now returns
  `{JobId, Timestamp}`. Pre-existing core bug: `_getDriverUrl()` was not awaited, so this call
  could never work.
- **Version endpoint.** `/api/v1/structure/about/version` exists, anonymous, returns a bare
  string. The legacy path depends on a proxy feature flag and can return HTML 200 when off,
  so `isApiReachable` must probe the v1 path.
- **Errors.** v5 returns RFC 7807 problem+json with `title` = error code. New status codes
  404/409/422/423/502. Core does no error parsing today, so this is greenfield.
- **Legacy rewriter gaps.** Six entity types (Recipient, RecipientGroup, AlarmingPlan,
  MaintenanceService, TaskDefinition, RuntimeScript) use `/alarming/`, `/maintenance/`,
  `/runtime/` in core but the rewriter expects `alarm`, `maint`, `runti`, so they 404 via
  legacy URLs regardless. Possibly these core paths were already wrong on v4; verify against
  a live v4 system. Confirms decision 4: do not rely on the rewriter.
- **Additive v5 endpoints worth adopting.** `GET {segment}/count?$filter=` and
  `GET {segment}/entity-info` (replaces the N+1 lookups in `EntityNameService`).

## Open items before implementation

1. Verify the `QUERY` HTTP verb works end to end through axios in the browser and in Node,
   including through the proxy. If not, this needs a platform-side fallback.
2. Verify against a live v4 system whether core's `/alarming/`, `/maintenance/`, `/runtime/`
   entity paths ever worked, or whether the gateway only served `alarm`, `maint`, `runti`.
3. Platform-side tickets: confirm the additive-only rule is written down in the platform
   repo; ask whether an `ApiVersion` marker in `application.config` is acceptable so no probe
   is needed.
4. Capture fixtures from a 4.12, a 4.23 and a 5.0 system for the entities core models.
5. Inventory which apps consume audako-core and which entities/services each uses, to size
   the adapter work and set each app's minimum version. Check especially who uses Storage (it is being removed),
   the historical value operations, and the multiple-copy/move calls.

## Rollout

1. Major bump of audako-core with `ApiContext`, version helper, compatibility check,
   endpoint resolver. Adapters as identity. Works against v4 and v5 (v5 via correct new
   URLs, no reliance on the rewriter).
2. Add v4 adapters entity by entity as the diffs from open items 1 and 2 dictate, with
   fixture tests.
3. Migrate apps to the new constructor and add the compatibility check at connect time.
4. Enable deprecation logging in one app against a v5 system to confirm no legacy paths
   remain.

## Implementation notes (2026-09-04)

Deliberate deviations from, and decisions taken beyond, the plan above. Each one is also
commented at the code site.

**Version helper**

- `checkCompatibility` has a sixth status, `invalidVersion`, beyond the four the plan lists. It
  covers both an unparseable version string and a 4.x above the final 4.23 (which cannot exist).
- `detectApiVersion` throws `ApiVersionDetectionError` when neither version path answers usably.
  The plan did not name an error for the detection step itself.
- `HttpConfig.ApiVersion` (open item 3) is already read: when the config carries it, nothing is
  probed. Harmless if the platform never adds the key.
- `ApiVersionInfo` is cached per `ApiContext`, but a *failed* detection is not cached, so a
  transient network error does not permanently break the context.

**Adapters**

- `EventCategory.toWire` below 4.23 writes **both** `Acknowledgment` and `RequiresAcknowledgment`.
  The release attribution of the rename is fuzzy by about one release
  (docs/analysis/v4-models-4.22-4.23.md), and both platforms bind the payload to their typed model
  and ignore the key they do not know.
- `BatchDefinition.MetadataField.Editable` below 4.17 is derived as
  `Source == Manual && ObligatoryAt == Stop`, i.e. exactly what `BatchDefinitionMigrator_V1` does.
  Non-manual fields stay `false`, not `ObligatoryAt`-derived.
- `TranslatableField.Translations` is **not** stripped on writes below 4.16. The server ignores the
  unknown key, the write does not fail, and stripping it would only hide from the caller that the
  data went nowhere. Translations stay behind the `translations` feature flag.
- The shared `baseFromWire` default pass does **not** descend into `_t`-discriminated sub-settings
  (`DataConnection.Settings`, so `OpcUaSettings.TimestampSource` and the MeterBus fields) or into
  array elements (`Formula.Variables[].TagScope`). They are `null`/empty on the default instance,
  so there is no template to walk; they need a per-entity adapter that knows the concrete class.
- `baseFromWire` skips a sub-object whose `_t` differs from the default instance's. `Signal.Settings`
  defaults to `SignalAnalogSettings`, and the pass used to fill counter and digital settings with
  the analog fields (`MinValue`, `DefaultValue`, later `ScalingCalculatorState`).
- Promoted `AdditionalFields` keys (platform #3482): a v4 read moves a convertible key onto its
  property and removes it from the map, keeping `OOAttributes`; a v4 write writes it back and
  merges into the map, so third-party keys survive. `null` removes the key, except a stored value
  the read could not convert. `CounterChecked` absent on a counter reads as `true` like after the
  v5 migration; writes to a counter always carry an explicit `"true"`/`"false"`. Query keys are
  not rewritten (decision 7): `AdditionalFields.Icon.Value` on v4, `Icon.Value` on v5.
- `baseFromWire` runs in one of two modes. A full read fills absent *and* present-but-null keys
  from the model constructor defaults; a `$projection` read only fills present-but-null keys,
  because filling absent ones would fabricate server state for keys the caller never asked for.
  `EntityHttpService` picks the mode from the presence of a projection, in both
  `getPartialEntityById` and `queryConfiguration`. Per-entity adapters get the mode as a third
  `fromWire` argument for the same reason (`RuntimeScript.Enabled`, `EventDefinition.EventCategoryId`).
- The v4 adapters register themselves as a side effect of importing
  `lib/compat/adapters/index.ts`, which is the entry point `EntityHttpService` uses.
  `entity-adapter.ts` (the registry) must stay free of imports from `v4/`, or registration would
  depend on module evaluation order. Verified to happen in both the CJS and the ESM build output.

**Historian**

- `HistoricalValueRequest.MinMaxInterval` is removed from the public request type instead of being
  mapped: v4 accepted `MinMaxIntervalType` as well, so the canonical v5 field alone works on both
  versions and no adapter is needed.
- v4 operation status mapping: `Processing -> Pending` (v5 does not distinguish queued from
  running) and `Undone -> Completed` plus `IsRedoable: true` (v5 expresses the undo state through
  `IsUndoable`/`IsRedoable`, not through the status). Both v4-only values, and the v4-only audit
  fields (`Timezone`, `CreatedOn`, `CreatedBy`, `ChangedOn`, `ChangedBy`), live only in the v4
  wire type inside the adapter; the adapter drops the old keys from the result.
- `getCounterOffsets` no longer emits the stray leading `&` after `?` that v4 core produced.

**Endpoints and services**

- `EntityHttpService.getEntityInfosByIds` assumes `entity-info` accepts the store's
  `$filter {Id: {$in: [...]}}` operator form. The analysis doc documents no filter grammar for the
  endpoint, so this is the one place where the batching in `EntityNameService` rests on an
  assumption; it falls back to the per-id lookups when the request fails.
- The `version` endpoint exists in both endpoint tables for completeness, but version detection
  uses the two static paths directly: it has to run before there is a version to resolve against.
- `BaseHttpService` is removed: services hold a public `ctx: ApiContext` and call
  `ctx.request(endpoint, options)`, which resolves the URL, sends and normalizes errors. Only the
  resolver knows the per-version routes, and 2.0 ships no compatibility shims.
- The endpoint table is one `{ method?, v4, v5 }` row per endpoint
  (`lib/compat/endpoints/endpoints.ts`). `method` is omitted where the caller picks the verb
  (`entityById`, `userProfile`) and given per version where it changed (`entityQuery`, undo/redo).
  The v4 per-entity path map (`V4_ENTITY_PATHS`) and the v5 segments (`V5_ENTITY_SEGMENTS`) live
  next to it, typed `Record<EntityType, string>`; both are wire details and are not exported.
- No compatibility shims: every service takes only `ApiContext`, and the deprecated aliases
  (`getNearesValue`, `getHistoricalValues`, camelCase `SetCustomOffsetRequest`) are deleted. The
  owner controls all consumers, so the major carries the full break; see docs/migration-2.0.md
  section 5.
- The deprecation logger is installed automatically on every `ApiContext`. Apps redirect it with
  `setDeprecationSink` and read `getDeprecatedPaths` from `lib/api/deprecation.ts`; the logger
  class itself stays in the non-exported `lib/compat`.

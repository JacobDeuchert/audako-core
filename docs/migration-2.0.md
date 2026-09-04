# audako-core 2.0 migration guide

audako-core 2.0 talks to audako platform **4.12 - 4.23 and 5.0+** from one build. Version
handling lives in core: services resolve their own URLs per version and adapt payloads at the
wire boundary. Apps see one set of models and never branch on the platform version.

See `docs/v4-v5-compatibility-plan.md` for the design and `docs/analysis/` for the underlying
platform diffs.

## 1. New constructor: `ApiContext`

Every service took `(httpConfig, accessToken)`. It now takes a single `ApiContext`, which also
carries the detected platform version. **Breaking:** the two-argument form is gone from every
service, including `LiveValueService`; wrap the config in an `ApiContext` once and pass that.

```ts
// before
const service = new EntityHttpService(httpConfig, accessToken);

// after
const ctx = await ApiContext.connect(systemUrl, accessToken);
const service = new EntityHttpService(ctx);
```

The `ApiContext` itself still takes `(httpConfig, accessToken)`. Without an explicit
`ApiVersionInfo` it detects the version lazily on the first request (one extra GET), or reads it
from `HttpConfig.ApiVersion` when the config provides it.

Build the context yourself when you already have the config:

```ts
const ctx = new ApiContext(httpConfig, accessToken);            // detects lazily
const ctx = new ApiContext(httpConfig, accessToken, versionInfo); // explicit, nothing probed
const ctx = ApiContext.from({ httpConfig, accessToken });        // plain object form
```

`accessToken` and `httpConfig` are still `AsyncValue`s (value, promise, observable or factory), so
a token that is refreshed keeps working. Share one context per system: it owns the axios instance
that adds the `Authorization` header and the deprecation logging.

## 2. Check compatibility at connect time

`ApiContext.connect` loads `application.config`, detects the version and asserts compatibility
before the first real request:

```ts
try {
  const ctx = await ApiContext.connect(systemUrl, accessToken, {
    minVersion: '5.1',    // minimum on the 5.x line
    supportsV4: false,    // this app does not support v4 at all
    minV4Version: '4.16', // minimum on the 4.x line, when v4 is supported
  });
} catch (error) {
  if (error instanceof IncompatibleBackendError) {
    show(error.result.status, error.result.message); // structured, ready to display
  }
}
```

The pieces are public and usable separately:

- `detectApiVersion(apiUrl, { platformVersion?, httpConfig?, timeoutMs? })` -> `ApiVersionInfo`.
  Probes `/api/v1/structure/about/version` first, then the pre-v1 path. Throws
  `ApiVersionDetectionError`.
- `checkCompatibility(versionInfo, requirements)` -> `CompatibilityResult`
  (`status`, `compatible`, `detected`, `required`, `message`). Never throws.
- `assertCompatible(versionInfo, requirements)` - same, throws `IncompatibleBackendError`.
- `CORE_SUPPORTED_WINDOW` - the window core itself was built against.

Statuses: `ok`, `newerThanKnown` (5.x newer than core knows - allowed, warn), `tooOld`,
`unsupportedMajor` (v4 opt-out), `unknownMajor` (6+), `invalidVersion` (unparseable, or a 4.x
above the final 4.23).

## 3. Feature flags instead of version comparisons

```ts
const versionInfo = await service.getVersionInfo();
if (versionInfo.supports('entityInfo')) { ... }
```

Available features: `translations` (>= 4.16), `entityMappings` (>= 4.15), `queryVerb`,
`entityCount`, `entityInfo`, `optimisticConcurrency`, `historicalValueOperationsV2`,
`acknowledgmentField` (all >= 5.0), `requiresAcknowledgmentField` (>= 4.23).
`ApiVersionInfo` also exposes `apiVersion`, `platformVersion`, `isV4`, `isV5` and
`isAtLeast('4.17')`. Prefer `supports()`; version comparisons in app code are what 2.0 exists to
remove.

## 4. Storage is gone

`Storage`, `StorageEntry`, `FileEntry`, `EntityType.Storage`, its v4 endpoint path and
its `EntityTypeClassMapping` entry were removed. v5 replaced the entity with a service-local
`DashboardTabStorage` with different fields and endpoints, so there is nothing to adapt. Apps that
used it need a platform-side successor; nothing in core replaces it.

## 5. Changed return types and payloads

| API | Change |
|---|---|
| `EntityHttpService.copyMultipleTo` / `moveMultipleTo` | Return `Promise<string>` (the operation id). Previously the raw axios response with a text body. v5 answers `{"OperationId":"..."}`, v4 the bare id; both are normalized. |
| `EntityHttpService.updateEntity` | No longer mutates the entity you pass in. `CreatedBy`/`CreatedOn` are stripped from the wire copy on v4 only; on v5 they are kept and `ChangedOn` is round-tripped, because it is the optimistic-concurrency token there. Round-trip the entity you got from the GET, or v5 answers `EntityChangedElsewhere`. |
| `EntityHttpService.getPartialEntityById` / `queryConfiguration` | Unprojected reads get model defaults filled in for absent and `null` fields. Projected reads only get `null` fields filled - keys you did not request stay absent. |
| `HistoricalValueService.getNearestValue` | Returns `MeasuredValue`, not `HistoricalValue & {Value: number}`. `Value` is free-form on v5; check the type before using it as a number. |
| `HistoricalValueService.getHistoricalValueObjects` / `getNthHistoricalValue` | Still `HistoricalValueObject`, but v4 rows are normalized: a flat `Note`/`CreatedBy` pair is lifted into `Notes[]`. The v5 `Min*`/`Max*` fields are undefined on v4. |
| `HistoricalValueService.setCustomOffset` | Takes the PascalCase `SetCounterCustomOffsetRequest` (`{Timestamp, Value, Note?, Source}`). The service re-cases per version - v5 requires PascalCase, v4 read it camelCase. |
| `HistoricalValueRequest.MinMaxInterval` | Removed: v5 dropped the field and v4 already accepted `MinMaxIntervalType`. Use `MinMaxIntervalType`. |
| `HistoricalValueOperation` | Follows the v5 shape: `UserId`, `StartedOn`, `StoppedOn`, `ErrorMessage`, `Progress`, `IsUndoable`, `IsRedoable`, `LiveOperationId`, `Layer`. The v4-only `Timezone`, `CreatedOn`, `CreatedBy`, `ChangedOn`, `ChangedBy` are **not** part of the type any more: the v4 adapter maps them onto the canonical fields and drops the old keys. `Status` is `Pending \| Completed \| Failed`; the v4-only `Processing` and `Undone` values are gone from the enum and mapped on read (see implementation notes in the plan). |
| `DataSourceHttpService.sendDatSrcConfiguration` | Returns `DriverJobInfo \| null` (`{JobId, Timestamp}` on v5, `null` on v4). This call never worked before: the driver URL was not awaited, so the request went to `[object Promise]/command/...`. |
| `DataConnectionBrowserService.browseConnection` | Returns `ConnectionBrowseItem[]` instead of `any`. |
| `EventCategory.Acknowledgment` | New optional field, **v5 only**, and not the same thing as the v4 wire key of that name (which was the old spelling of `RequiresAcknowledgment`). Gate on `supports('acknowledgmentField')`. |
| `HttpConfig` | New optional keys (`Services.Ticket`/`Manufacturing`/`Runtime`/`ExternalApi`, `Authentication.RequireHttps`, `Configuration`, `ApiVersion`). Never build URLs as `BaseUri + '/v1/...'`; the `/v1` lives in the per-service paths and the migration is per service. |
| `BaseHttpService.isApiReachable` | Probes the v1 version path first. With the legacy proxy rewrite disabled the old path answers HTML 200, which used to be a false positive. |
| `BaseHttpService.getStructureUrl` | Removed, together with the protected `httpConfig` accessor. Subclasses resolve endpoints (`this.resolve({ name })`) or read `this.ctx` instead of building URLs. |

New, v5-only and gated:

- `EntityHttpService.countEntities(type, filter?)` - `supports('entityCount')`.
- `EntityHttpService.getEntityInfos(type, options?)` / `getEntityInfosByIds(type, ids)` -
  `supports('entityInfo')`. `EntityNameService` uses this automatically on v5 and falls back to
  the per-id lookups on v4.
- `queryConfiguration(..., { sort, language })` - `$sort` and the `Language` header; both are
  silently dropped on v4.

Removed outright. 2.0 carries no compatibility shims; every one of these has a canonical
replacement listed above:

- The `(httpConfig, accessToken)` constructor of every service and of `LiveValueService`. Only
  `constructor(ctx: ApiContext)` remains.
- `BaseHttpService.getStructureUrl()` and the protected `BaseHttpService.httpConfig` accessor.
- `HistoricalValueService.getNearesValue` (typo alias of `getNearestValue`) and
  `HistoricalValueService.getHistoricalValues` (duplicate of `requestHistoricalValues`).
- The camelCase `SetCustomOffsetRequest`; `setCustomOffset` takes only
  `SetCounterCustomOffsetRequest`.
- `HistoricalValueRequest.MinMaxInterval`; use `MinMaxIntervalType`, which v4 also accepts.
- `HistoricalValueOperation.Timezone` / `.CreatedOn` / `.CreatedBy` / `.ChangedOn` / `.ChangedBy`
  and `HistoricalValueOperationStatus.Processing` / `.Undone`.
- `EntityHttpEndpoints` (the v4 per-entity path map). It was a wire detail, not a model, and now
  lives as `V4_ENTITY_PATHS` in the non-exported `lib/compat/endpoints/endpoints.v4.ts`.

Errors are now parsed: `ApiError` (`status`, `title`, `detail`, `type`, `instance`, `raw`) with
`EntityLockedError` for the v5 `423 Locked`. `title` carries the platform error code on v5.

## 6. Deprecation logger

v5 answers every request that came in through a legacy (pre-`/api/v1`) URL with
`Deprecation: true`. The axios instance of every `ApiContext` installs a response interceptor that
warns once per path:

```
[audako-core] Deprecated platform endpoint: GET https://host/api/structure/base/user/1 (successor: ...)
```

Nothing has to be enabled; watch the console of an app running against a v5 system and any warning
is a core call site still on a legacy URL. There should be none.

The logger itself (`DeprecationLogger`, `deprecationLogger`, `setSink`, `getLoggedPaths`) lives in
`lib/compat/`, which is deliberately **not** part of the public export surface - it is the
version-specific layer and disappears with the v4 end of life. That means the sink cannot be
redirected into an app's own logging yet; if that is needed for rollout, core has to grow a small
public facade for it (see `docs/v4-v5-compatibility-plan.md`, implementation notes).

## 7. Open items that still need a live system

These are implemented from the platform source analysis and are **not** verified against running
systems yet:

1. **The `QUERY` verb.** v5 entity queries use `QUERY {segment}` (the `/query` sub-path answers
   405). It works with axios in Node; browser XHR/fetch through the proxy is unverified. There is
   deliberately no POST fallback - it would have to be platform-side.
2. **The six `/alarming/`, `/maintenance/`, `/runtime/` v4 paths** (`Recipient`, `RecipientGroup`,
   `AlarmingPlan`, `MaintenanceService`, `TaskDefinition`, `RuntimeScript`). The v5 rewriter
   expects `alarm`, `maint`, `runti`, which suggests core's v4 paths may never have worked. The v4
   endpoint table reproduces exactly what core sent before, so v4 behaviour is unchanged either
   way; if a live 4.x system rejects them, the v4 table needs the trimmed prefixes.
3. **Fixtures.** `test/fixtures/v4|v5` are hand-written from the analysis docs, not captured from
   real 4.12 / 4.23 / 5.0 systems. Adapter round-trips are only as correct as those fixtures.
4. **`setCustomOffset` / `deleteCustomOffsets`** have no legacy rewrite on v5 and 404 through the
   old URLs; they are only exercised against the new paths in tests.
5. **`SubscribeMany` silently drops ACL-denied ids** on v5, and un-prefixed ids are denied.
   `LiveValueService`'s local subscription bookkeeping can therefore believe it is subscribed to
   ids that never emit.

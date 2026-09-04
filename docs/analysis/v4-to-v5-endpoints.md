# audako-core (v4 client) -> audako v5 platform API mapping

Scope: every HTTP/SignalR call made by `/home/dev/src/github/audako-core/lib/services/*.ts`.
All calls live in `lib/services/`; nothing else in `lib/` opens a socket (verified by grep for `axios`/`HubConnectionBuilder`).

## Base URL construction in v4 (audako-core)

`lib/models/http-config.model.ts` + `lib/services/base-http.service.ts`:

```
structureUrl = HttpConfig.Services.BaseUri + HttpConfig.Services.Structure
historianUrl = HttpConfig.Services.BaseUri + HttpConfig.Services.Historian
driverUrl    = HttpConfig.Services.BaseUri + HttpConfig.Services.Driver   // NOTE: Driver is NOT declared in the HttpConfig interface
liveHubUrl   = HttpConfig.Services.BaseUri + HttpConfig.Services.Live + '/hub'
```

Entity paths come from `EntityHttpEndpoints` in `lib/models/entities/configuration-entity.model.ts`
(e.g. `Group: '/base/Group'`, `Signal: '/daq/Signal'`, `Recipient: '/alarming/Recipient'`).

In v5 the version moved **into the per-service path**: `Services.BaseUri` still ends in `/api`, and
`Services.Structure` is now `/v1/structure`. So the effective prefix becomes `.../api/v1/structure`.
Auth is unchanged: `Authorization: Bearer <token>`.

---

## Mapping table

| audako-core service.method | v4 request (method + URL) | v5 request | request/response contract differences | Legacy rewrite exists in v5? | Notes |
|---|---|---|---|---|---|
| `BaseHttpService.requestHttpConfig` | `GET {systemUrl}/assets/conf/application.config` | `GET {systemUrl}/assets/conf/application.config` | Same top-level shape (`Services`/`Authentication`), but **new keys** and **per-service `/v1` paths**. See "HttpConfig findings". | n/a (static asset) | Served by the UI nginx with `Cache-Control: no-store` (`ui/nginx.conf:27`). Only `Services.BaseUri`, `Authentication.*` and `Configuration.*` are env-overridable (`ui/docker/buildConfig.sh`); per-service paths are baked in. |
| `BaseHttpService.isApiReachable` | `GET {apiUrl}/api/structure/about/version` | `GET {apiUrl}/api/v1/structure/about/version` | Body is a bare string (e.g. `5.1.20250902-abcdef`, or `unknown`). `AllowAnonymous()` + `AllowWithoutLicense()` -> expect **200 without a token**. | **Yes** — Structure catch-all `^api/structure(/.*)?$ -> api/v1/structure$1` (`LegacyUrlRewrites.cs:2072`) | The legacy path additionally depends on the YARP flag `ReverseProxy:Legacy:Structure`. If disabled, `/api/structure/...` falls through to the UI catch-all route and returns **HTML 200**, so the probe would false-positive. **Switch to `/api/v1/...`.** The 200-or-401 heuristic stays safe. |
| `EntityHttpService.getEntityById` / `.getPartialEntityById` | `GET {structure}{endpoint}/{id}` <br> `GET {structure}{endpoint}/{id}?$projection={json}` | `GET /api/v1/structure/{segment}/{id}` <br> `?$projection={json}` | Response is the typed entity (nested `_t` discriminators preserved); no `_id`->`Id` fixup needed. `$projection` unchanged (`1`/`-1` JSON), but now applied at the response boundary by `EntityProjectionFilter`. **Projection is silently ignored** if any key contains `.`, if include/exclude are mixed, if a value is not exactly `1`/`-1`, or if the JSON is unparseable (v4 could 500). `Id` is auto-added to include projections. | **Yes** — per-entity, e.g. `^api/structure/base/user/([^/]+)$ -> api/v1/structure/users/$1` | URL segment changes per entity — see "Entity segment map". |
| `EntityHttpService.queryConfiguration` | `POST {structure}{endpoint}/query` <br> body `{$filter, $paging, $projection}` (all JSON-encoded strings) <br> resp: `T[]` + header `paging-headers` | **`QUERY /api/v1/structure/{segment}`** <br> body `{$filter, $sort, $paging}` <br> `?$projection={json}` as **query param** | **BREAKING, 3 ways.** (1) HTTP method becomes the **`QUERY`** verb; the `/query` path segment is **gone** (`POST .../query` now 405). (2) **`$projection` in the body is ignored** — must move to the query string. (3) New optional `$sort` (JSON string) and `Language: de-DE` header (enables `Name.TranslatedValue` for filter/sort; invalid BCP-47 -> 400). Body itself is optional (bodyless QUERY = unfiltered list). `$filter`/`$paging` remain JSON-**encoded strings**. Response header `Paging-Headers: {"TotalCount":N}` unchanged and still only present when `$paging` was sent, so `JSON.parse(h).TotalCount` still works. | **Rewrite exists but is DEAD** — `^api/structure/daq/signal/query$ -> api/v1/structure/signals/query` rewrites fine but the target answers no POST/GET (405/404). 62 such rules. | Highest-effort change in the whole migration. Reference impl: `ui/src/app/data-access/api/query-http.service.ts` (`QUERY_METHOD = 'QUERY'`). For axios, `method: 'QUERY'` works in Node; **verify browser XHR/fetch accept the `QUERY` verb** before shipping. Also: `path-query` was removed outright (commit `1a21be3fa`) — no successor. |
| `EntityHttpService.uploadProcessImage` | `POST {structure}/scada/ProcessImage/{id}/file/image` <br> multipart, field `file` | `POST /api/v1/structure/process-images/{id}/image` | `/file/` segment dropped. Field name `file` unchanged. `DisableAntiforgery()`, 500 MB limit. Response 200, empty body. | **Yes** — `^api/structure/scada/processimage/([^/]+)/file/image$ -> api/v1/structure/process-images/$1/image` | Companions: `GET {id}/image`, `GET {id}/rendered`. |
| `EntityHttpService.addEntity` | `POST {structure}{endpoint}` body = entity | `POST /api/v1/structure/{segment}` | Still returns **200** (not 201) with the created entity. A client-supplied `Path` is discarded. Non-JSON `Content-Type` -> **415**; malformed/empty body -> 400 `{Entity}.InvalidRequest`. | **Yes** — `^api/structure/base/user$ -> api/v1/structure/users` | Connector and DataSource have dedicated slices on the same route (secret / Address+Password generation) — same URL and shape. |
| `EntityHttpService.updateEntity` | `PUT {structure}{endpoint}/{entity.Id}` <br> client `delete`s `CreatedBy` + `CreatedOn` first | `PUT /api/v1/structure/{segment}/{id}` | **Two contract changes.** (1) The `CreatedBy`/`CreatedOn` stripping is **no longer necessary** — `ConfigurationService.UpdateAsync` restores both from the stored doc (`ConfigurationService.cs:422-423`); sending them is harmless. (2) **`ChangedOn` is now an optimistic-concurrency token** (`ConfigurationService.cs:418-420`): a value differing from stored by >1 ms throws `EntityChangedElsewhere`. **Must round-trip `ChangedOn` from the GET — do not strip it.** Also `payload.Id` must equal route `{id}` (else 400), 415 non-JSON, **423 Locked** for a locked subtree. | **Yes** (verb-agnostic rewrite, so the legacy PUT hits the v5 PUT) | ACL is `Configuration`, except `dashboard-tabs` (`Configuration.Dashboard`) and `recipient-groups` (`Operate`). |
| `EntityHttpService.deleteEntity` | `DELETE {structure}{endpoint}/{id}` | `DELETE /api/v1/structure/{segment}/{id}` | Still **204 No Content**. Blank id -> 400; 403; 423 Locked. | **Yes** | New in v5: `PUT delete/multiple` (body `string[]` -> `{OperationId}`), `POST deletion-plan`, `POST cascading-deletions` (see `docs/deletion-flow.md`). |
| `EntityHttpService.copyTo` | `GET {structure}{endpoint}/copy/{sourceId}/to/{targetId}` | `GET /api/v1/structure/{segment}/copy/{sourceId}/to/{targetId}` | Identical shape; still a mutating GET. Returns 200 + copied entity. Blank ids now 400 (was 500). | **Yes** | |
| `EntityHttpService.copyMultipleTo` | `PUT {structure}{endpoint}/copy/multiple/{targetId}` <br> body `string[]`, `responseType: 'text'` -> `string` | `PUT /api/v1/structure/{segment}/copy/multiple/{targetId}` | **Response shape changed**: now `application/json` `{"OperationId":"<id>"}` (`OperationStartedResponse`). The client's `responseType: 'text'` receives the JSON object as a string -> **must `JSON.parse` and read `.OperationId`**. Empty list accepted; blank `{targetId}` -> 400. | **Yes** | The returned `OperationId` is subscribable over the Live hub with the `OP:` prefix. |
| `EntityHttpService.moveTo` | `GET {structure}{endpoint}/move/{sourceId}/to/{targetId}` | `GET /api/v1/structure/{segment}/move/{sourceId}/to/{targetId}` | Identical. | **Yes** | |
| `EntityHttpService.moveMultipleTo` | `PUT {structure}{endpoint}/move/multiple/{targetId}` <br> body `string[]`, `responseType: 'text'` | `PUT /api/v1/structure/{segment}/move/multiple/{targetId}` | Same `{"OperationId":"..."}` change as `copyMultipleTo`. | **Yes** | |
| `EntityNameService.resolveEntityPath` / `.resolvePathName` / `.resolveName` | (no direct HTTP) — delegates to `getPartialEntityById(type, id, {Name:1, Path:1})` | same | Inherits the `getPartialEntityById` behaviour. `Path` is now denormalized server-side and present when hydrated. | via `getPartialEntityById` | **Better v5 option**: `GET /api/v1/structure/{segment}/entity-info` returns `{Id, Name, Description, Type, GroupId, Path}` in one call for a filtered set — replaces the N+1 name-resolution loop this service performs. |
| `TenantHttpService.getTenantViewById` | `GET {structure}/tenant/{id}/view` | `GET /api/v1/structure/tenants/{tenantId}/view` | Response `TenantView` unchanged. | **Yes** | |
| `TenantHttpService.getTenantViewForEntityId` | `GET {structure}/tenant/entity/{entityId}/view` | `GET /api/v1/structure/tenants/**entities**/{entityId}/view` | Path segment `entity` -> `entities`. Response unchanged. | **Yes** — `^api/structure/tenant/entity/([^/]+)/view$ -> api/v1/structure/tenants/entities/$1/view` | |
| `TenantHttpService.getTopTenants` | `GET {structure}/tenant/top` | `GET /api/v1/structure/tenants/top` | `List<TenantView>` unchanged. | **Yes** | Distinct endpoint `GET tenants/top-admin` returns full `Tenant` objects, not views. |
| `TenantHttpService.getNextTenants` | `GET {structure}/tenant/{tenantId}/next` | `GET /api/v1/structure/tenants/{tenantId}/next` | Unchanged (declared `Produces<object>`, returns the tenant-view list). | **Yes** | |
| `TenantHttpService.filterTenantsByName` | `GET {structure}/tenant/filter/{name}` | `GET /api/v1/structure/tenants/filter/{filterString}` | Route param renamed only (positional, no client impact). `List<TenantView>`. | **Yes** | |
| `UserProfileHttpService.getUserProfile` | `GET {structure}/userprofile` | `GET /api/v1/structure/user-profile` | Response `UserProfile` unchanged. Group carries `AllowWithoutLicense`. | **Yes** — `^api/structure/userprofile$ -> api/v1/structure/user-profile` | |
| `UserProfileHttpService.updateUserProfileSettings` | `PUT {structure}/userprofile` body `Record<string,string>` | `PUT /api/v1/structure/user-profile` | Body `Dictionary<string,string>` unchanged. Response **200 with empty body**. | **Yes** | New: `DELETE /api/v1/structure/user-profile/settings/{key}`. |
| `HistoricalValueService.requestHistoricalValues` / `.getHistoricalValues` | `POST {historian}/value/manyflat` body `HistoricalValueRequest[]` | `POST /api/v1/historian/historical-values/query-many-flat` | Body is `List<ValueQuery>`. **`MinMaxInterval` was dropped** (only `MinMaxIntervalType` remains) — the client's optional `MinMaxInterval` field must be removed/renamed. New optional `Reference` (string) and `LimitDbHours` (int?). Response `List<Dictionary<string,object>>` — flat-row shape unchanged, dict keys **not** camelCased. | **Yes** | These two client methods are duplicates hitting the same URL with different declared return types. |
| `HistoricalValueService.getHistoricalValueObjects` | `POST {historian}/value/many` | `POST /api/v1/historian/historical-values/query-many` | Response is `MeasuredValuePackage[]` = `{ObjectType, ObjectId, IntervalType, Values[]}` — maps 1:1 onto v4 `HistoricalValueObject`. Each value gains `MinTimestamp`/`MinValue`/`MaxTimestamp`/`MaxValue`, `Source` (now includes `Note`), `CreatedBy`, and `Notes[] {Note, Timestamp, CreatedBy}`. Same `MinMaxInterval` drop. | **Yes** | Also available: `POST .../query` (single query -> single package) and `.../query-many-object` (legacy `/value/manyobj`). |
| `HistoricalValueService.getNearestValue` (+ alias `getNearesValue`) | `POST {historian}/value/nearest` body = single request | `POST /api/v1/historian/historical-values/nearest` | **Response shape changed**: returns a full `MeasuredValue`, not `HistoricalValue & {Value:number}`. `Value` is `object` (free-form), so the client's `{Value: number}` typing is wrong. 403 added. | **Yes** | |
| `HistoricalValueService.getNthHistoricalValue` | `POST {historian}/value/nth` | `POST /api/v1/historian/historical-values/nth` | Request `{Count, ObjectType, ObjectId, IntervalType, Timestamp, Timezone}` identical. Response is `MeasuredValuePackage` (was `HistoricalValueObject`) — same field names. | **Yes** | |
| `HistoricalValueService.postManualData` | `POST {historian}/value/manual` body `ManualDataRequest[]` | `POST /api/v1/historian/historical-values/manual` | Body `List<ManualValue>`: all v4 fields plus a new optional `Prefix` string. `Timezone` defaults to `"CET"`. Response 200, empty. | **Yes** | |
| `HistoricalValueService.postNoteEntries` | `POST {historian}/value/note` | `POST /api/v1/historian/historical-values/**notes**` | Path pluralized. Body `List<ManualNoteEntry>` identical to v4. Response 200, empty. | **Yes** | |
| `HistoricalValueService.getCounterOffsets` | `GET {historian}/value/counter/{id}/offsets?&$from=ISO&$till=ISO` | `GET /api/v1/historian/historical-values/counters/{signalId}/offsets?$from=&$till=` | Query param names `$from`/`$till` **unchanged**, both optional. Response `Dictionary<string, OffsetView>` where `OffsetView = {Calculated: double?, Custom: CustomOffset, Effective: double}` and `Custom` is an object `{Value, Source, Author, Note, Created, Updated}`. Matches the client's existing `OffsetView`/`CustomOffsetView` types. | **Yes** | Client builds the URL as `...offsets?` then appends `&$from=` — a leading `&` after `?`. Harmless but worth cleaning. |
| `HistoricalValueService.setCustomOffset` | `POST {historian}/value/counter/{id}/offsets/custom` body `{timestamp, value, note, source}` | `POST /api/v1/historian/historical-values/counters/{signalId}/offsets/custom` | Body is PascalCase `SetCounterCustomOffsetRequest {Timestamp, Value, Note?, Source}`. The client currently sends **camelCase** keys (`timestamp`, `value`, `note`, `source`) — v5 sets `PropertyNamingPolicy = null` (PascalCase), so **the body must be re-cased**. `Source` must be an `OffsetSource` enum name (`Manual` \| `CounterReplacement` \| `CounterReadingAlignment`). | **NO** | The Historian rewriter only matches `.../offsets` and `.../offsets/remove`. This URL falls into the catch-all `^api/historian(/.*)?$` and lands on a non-existent `/api/v1/historian/value/counter/...` -> **404**. Must be migrated. |
| `HistoricalValueService.deleteCounterOffsets` | `POST {historian}/value/counter/{id}/offsets/remove` body `string[]` | `POST /api/v1/historian/historical-values/counters/{signalId}/offsets/remove` | **Response changed from void to a `bool` body.** Request unchanged. | **Yes** | Client declares `Promise<void>` and ignores the body — works, but the return type is now wrong. |
| `HistoricalValueService.deleteCustomOffsets` | `POST {historian}/value/counter/{id}/offsets/custom/remove` body `string[]` -> `boolean` | `POST /api/v1/historian/historical-values/counters/{signalId}/offsets/custom/remove` | Request and `bool` response unchanged. | **NO** | Same 404 trap as `setCustomOffset` — the `custom/remove` suffix is not in the rewriter. Must be migrated. |
| `HistoricalValueService.resetCalculatedValuesAndStatistic` | `POST {historian}/value/statistics/{signalId}/reset` body `{From, Till, ResetOffsets, ResetCustomOffsets}` | `POST /api/v1/historian/historical-values/statistics/{signalId}/reset` | Body is now optional (`EmptyBodyBehavior.Allow`); `From`/`Till` nullable; `ResetCustomOffsets` **defaults to `true`** server-side (client always sends it explicitly, so no drift). Response `{OperationId}` unchanged. | **Yes** | |
| `HistoricalValueService.importHistoricalValues` | `POST {historian}/historicalvalueimport/import` body `{Values: [...]}` | `POST /api/v1/historian/historical-value-imports` (bare group root, `MapPost("")`) | Body `{Values: List<Dictionary<string,object>>}` unchanged. Response `{OperationId}` unchanged. 1 GB request limit. | **Yes** | |
| `HistoricalValueManipulationHttpService.getHistoricalValueOperations` | `GET {historian}/historicalvaluemanipulation/operations/{signalId}` | `GET /api/v1/historian/historical-value-operations/{signalId}` | **Response contract diverges substantially.** v5 `HistoricalValueOperation` = `{Id, SignalId, UserId, StartedOn, StoppedOn?, Status, ErrorMessage, Progress, From, Till, OperationScript, OperationDescription, IsUndoable, IsRedoable, LiveOperationId, Layer}`. The client's model expects `CreatedOn/CreatedBy/ChangedOn/ChangedBy/Timezone` — **gone**, replaced by `UserId`/`StartedOn`/`StoppedOn`. `Status` enum narrows to `Pending` \| `Completed` \| `Failed` (client also declares `Processing`, `Undone`). | **Yes** | Sibling `GET .../{signalId}/pending` returns the single active operation. |
| `HistoricalValueManipulationHttpService.startHistoricalValueOperation` | `POST {historian}/historicalvaluemanipulation/operations/{signalId}/start` | `POST /api/v1/historian/historical-value-operations/{signalId}/start` | Request `{From, Till, Timezone, OperationScript, OperationDescription}` **identical**. Response is the v5 `HistoricalValueOperation` above (same divergence). | **Yes** | |
| `HistoricalValueManipulationHttpService.undoHistoricalValueOperation` | `PUT {historian}/historicalvaluemanipulation/operations/{operationId}/undo` | `POST\|PUT /api/v1/historian/historical-value-operations/{operationId}/undo` | `MapMethods(..., ["POST","PUT"])` -> **`PUT` still accepted**. No body, 200 empty, 404 added. | **Yes** | The `PUT` alias is itself flagged `// LEGACY:` in-source — prefer `POST`. |
| `HistoricalValueManipulationHttpService.redoHistoricalValueOperation` | `PUT .../operations/{operationId}/redo` | `POST\|PUT /api/v1/historian/historical-value-operations/{operationId}/redo` | Same as undo. | **Yes** | |
| `LiveValueService.connect` / `.connectWithUrl` | SignalR hub `{live}/hub`, token via `accessTokenFactory` | **`/api/v1/live/values`** | Transports restricted to **WebSockets + LongPolling** (no SSE). Token is still lifted from the `access_token` query param for hub paths (`Program.cs:51`), so `accessTokenFactory` keeps working. Hub is `[Authorize]`. | **Yes** — `^api/(v1/)?live/hub(/.*)?$ -> api/v1/live/values$2` (covers `/negotiate`) | Note `application.config` still maps `Live: "/live"` (no `/v1`), so the v4-style URL `{BaseUri}/live/hub` resolves via the legacy proxy route + rewrite. |
| `LiveValueService` hub methods (`SubscribeMany`, `ChangeModeAsync`, `ChangeIntervalAsync`) | `send('SubscribeMany', string[])`, `send('ChangeModeAsync', true)`, `send('ChangeIntervalAsync', 500)` | Same names | **All three names unchanged** (`SubscribeMany` was **not** renamed to `Subscribe`; `*Async` suffixes are on the wire). `ChangeIntervalAsync` is now **clamped to a 250 ms minimum** — `500` is honoured as-is. **New ACL gate** (`SubscriptionAccessChecker`): ids must be exactly `TYPE:id`; `SubscribeMany` **silently drops** ids the user cannot View and succeeds for the rest (`SubscribeOne` instead errors with `LiveValueErrors.SubscriptionForbidden`). | n/a (hub methods) | The silent-drop behaviour means the client's `_subscribedIds` bookkeeping can believe it is subscribed to ids that will never emit. Consider a timeout/reconcile. Also available: `SubscribeOne`, `UnSubscribeOne`, `UnSubscribeMany` — the client currently has **no** unsubscribe wire call (`_unsubscribeIds` only mutates local state). |
| `LiveValueService` hub event `Send` | `connection.on('Send', message)` -> array of `{identifier, timestamp, value}` | Same event name `Send`, single array arg | Payload is **camelCase** (SignalR protocol overrides the global PascalCase — `Program.cs:104-109`), matching what the client already reads. `S:` items are `LiveData {identifier, timestamp, value, quality}`; `SO:`/`T:`/`TC:` are `LiveStorageValuePackage {identifier, value, timestamp}` (**no `quality`**); `OP:` is `OperationHubPackage {identifier, id, name, createdOn, updatedOn?, progress, status, statusMessage?, error?}`. | n/a | The client's `OperationMessage` type declares `createdOn`/`updatedOn`/`status`/`statusMessage`/`error` — compatible; v5 adds `progress`. |
| `LiveValueService` subscription prefixes | `S:`, `SO:`, `T:`, `TC:`, `OP:` | Same | **All five unchanged** (`Services/Live/Live/Constants.cs`). New in v5: `SR:` (ResettableCounter), `EDS:` (EventDefinitionStatus), `CS:` (ConditionStatus). ACL map: `S`/`SO`/`SR`->Signal, `T`->DataSource, `TC`->DataConnection, `CS`->Condition, `EDS`->EventDefinition, `OP`->always granted, anything else denied. | n/a | `subscribeToTimestamp(ids)` passes ids through **un-prefixed** — callers must supply `T:`/`TC:` themselves, and an un-prefixed id is now **denied** by the ACL gate rather than ignored. |
| `DataConnectionBrowserService.browseConnection` | `POST {driver}/command/conn/{id}/browse` body `{Path}` -> `any` | `POST /api/v1/driver/command/conn/{id}/browse` | Path segment still `conn`. Body `{Path}` (default `""`) unchanged. **Response is now typed**: `ConnectionBrowseResponseItem[]` with explicitly lowercased JSON names `{description, address, expandable, selectable}` — can replace the `any`. | **Yes** — four ways: `/api/Command/...`, `/api/v1/Command/...`, `/api/driver/Command/...`, `/api/driver/v1/Command/...`, plus the `/api/driver -> /api/v1/driver` catch-all | |
| `DataSourceHttpService.sendDatSrcConfiguration` | `GET {driver}/command/source/{dataSourceId}/configure` -> void | `GET /api/v1/driver/command/source/{id}/configure` | **Response changed from void to a body**: `ConfigureDataSourceResponse {JobId, Timestamp}`. Method and path shape otherwise unchanged. | **Yes** (same four Command prefixes + catch-all) | **Pre-existing client bug**: `this._getDriverUrl()` is called **without `await`** (`data-source-http.service.ts:13`), so the URL literally contains `[object Promise]`. This call cannot currently work — fix while migrating. |

### Entity segment map (v4 `EntityHttpEndpoints` -> v5 route segment)

All v5 entity routes are `MapGroup($"/api/v1/structure/{entity.RouteSegment}")` with `.RequireAuthorization()`
(`Services/Structure/Structure/Features/Entity/EntityConfiguration.cs`), driven by a 28-entry registry
(`Features/Entity/EntityRegistry.cs`). The per-domain prefixes (`/base/`, `/daq/`, `/scada/`, `/alarming/`,
`/maintenance/`, `/runtime/`) are **gone**; the consolidation is internal, not a `/entities/{type}` route.

| v4 endpoint | v5 segment | v4 endpoint | v5 segment |
|---|---|---|---|
| `/base/Group` | `groups` | `/base/Storage` | `storages` |
| `/daq/Signal` | `signals` | `/scada/Camera` | `cameras` |
| `/daq/Formula` | `formulas` | `/scada/SwitchSchedule` | `switch-schedules` |
| `/base/Dashboard` | `dashboards` | `/base/User` | `users` |
| `/base/DashboardTab` | `dashboard-tabs` | `/base/Role` | `roles` |
| `/daq/DataConnection` | `data-connections` | `/alarming/Recipient` | `recipients` |
| `/daq/DataSource` | `data-sources` | `/alarming/RecipientGroup` | `recipient-groups` |
| `/daq/Connector` | `connectors` | `/alarming/AlarmingPlan` | `alarming-plans` |
| `/base/condition` | `conditions` | `/maintenance/MaintenanceService` | `maintenance-services` |
| `/scada/ProcessImage` | `process-images` | `/maintenance/TaskDefinition` | `task-definitions` |
| `/base/EventCategory` | `event-categories` | `/runtime/RuntimeScript` | `runtime-scripts` |
| `/base/EventDefinition` | `event-definitions` | `/scada/ReportTemplate` | `report-templates` |
| `/scada/batchdefinition` | `batch-definitions` | `/scada/Report` | `reports` |
| `/base/Document` | `documents` | (v5 also) | `switch-operations` |

**Prefix caveat for 6 entity types.** The v5 legacy rewriter encodes the v4 module prefixes as the
5-char-trimmed forms `alarm`, `maint`, `runti` (e.g. `^api/structure/alarm/recipient/...`). audako-core
instead uses `/alarming/`, `/maintenance/`, `/runtime/`. Confirmed against the v5 UI's pre-migration code
(commit `178ff6a7e` changed `configurationApiUrl + '/alarm/recipient'` and `'/alarm/AlarmingPlan'`), so
`alarm`/`maint`/`runti` are the forms the v4 gateway actually served. Consequently
**`Recipient`, `RecipientGroup`, `AlarmingPlan`, `MaintenanceService`, `TaskDefinition` and `RuntimeScript`
will NOT be caught by any legacy rewrite** — they fall into the `/api/structure` catch-all and 404.
These six must be repointed at the v5 segments regardless of the rewriter.

### Additive v5 endpoints worth adopting (no v4 equivalent, no legacy rewrite)

- `GET /api/v1/structure/{segment}/count?$filter={json}` (optional `Language` header) -> bare `long`, no paging headers. Replaces the `$projection={"Id":1}` count/existence hack.
- `GET /api/v1/structure/{segment}/entity-info?$filter=&$sort=&$paging=` -> `EntityInfoDto[]` = `{Id, Name, Description, Type?, GroupId, Path}`, sets `Paging-Headers` when `$paging` present. Directly replaces `EntityNameService`'s per-id lookups.
- Both exist for all 28 registry entities, including `groups`.

---

## Summary

### (1) Calls identical in v5 (path shape and contract both unchanged apart from the `/api/v1` prefix)

- `BaseHttpService.requestHttpConfig` — same asset URL; only the config *contents* changed.
- `EntityHttpService.getEntityById` / `getPartialEntityById` — `$projection` semantics preserved (with new silent-ignore guards).
- `EntityHttpService.deleteEntity` — still 204.
- `EntityHttpService.copyTo`, `moveTo` — still mutating GETs returning the entity.
- `TenantHttpService.getTenantViewById`, `getTopTenants`, `getNextTenants`, `filterTenantsByName`.
- `UserProfileHttpService.getUserProfile`, `updateUserProfileSettings`.
- `HistoricalValueService.getNthHistoricalValue` (request identical; response renamed type, same fields), `postNoteEntries` (body identical), `getCounterOffsets` (`$from`/`$till` preserved), `importHistoricalValues`.
- `HistoricalValueManipulation*.startHistoricalValueOperation` (request only), `undo`, `redo` (PUT still accepted).
- `LiveValueService` hub method names and the `Send` event, plus all five id prefixes.
- `DataConnectionBrowserService.browseConnection` — request identical.

### (2) URL-only changes (drop-in string edits, no body/response mapping)

- Every entity endpoint: `/{domain}/{Type}` -> `/{kebab-plural}` (see segment map).
- `uploadProcessImage`: `/{id}/file/image` -> `/{id}/image`.
- `getTenantViewForEntityId`: `/tenant/entity/` -> `/tenants/entities/`.
- `getUserProfile` / `updateUserProfileSettings`: `/userprofile` -> `/user-profile`.
- Historian value ops: `/value/manyflat` -> `/historical-values/query-many-flat`, `/value/many` -> `/query-many`, `/value/nearest` -> `/nearest`, `/value/nth` -> `/nth`, `/value/manual` -> `/manual`, `/value/note` -> `/notes`, `/value/counter/{id}/...` -> `/counters/{id}/...`, `/value/statistics/...` -> `/statistics/...`.
- `/historicalvalueimport/import` -> `/historical-value-imports`.
- `/historicalvaluemanipulation/operations/...` -> `/historical-value-operations/...`.
- Live hub: `{live}/hub` -> `/api/v1/live/values`.
- Driver: `{driver}/command/...` -> `/api/v1/driver/command/...`.
- `isApiReachable`: `/api/structure/about/version` -> `/api/v1/structure/about/version`.

### (3) Contract changes needing request/response mapping

Ordered by effort:

1. **`queryConfiguration` — the big one.** `POST .../query` becomes the **`QUERY` verb on the collection root**; `$projection` moves from the body into the **query string**; `$sort` and a `Language` header are new. `$filter`/`$paging` stay JSON-encoded strings, and `Paging-Headers: {"TotalCount":N}` is unchanged. **Verify axios/browser support for the `QUERY` method.** `path-query` has no successor at all.
2. **`updateEntity`** — stop deleting `CreatedBy`/`CreatedOn` (unnecessary; server restores them) and **start round-tripping `ChangedOn`**, which is now an optimistic-concurrency token (mismatch >1 ms -> `EntityChangedElsewhere`). New 423 Locked and Id-mismatch-400 cases.
3. **`copyMultipleTo` / `moveMultipleTo`** — response is now JSON `{"OperationId":"..."}` instead of a bare text string. Parse it (and consider subscribing to the operation via the Live `OP:` prefix).
4. **`setCustomOffset`** — body must be **re-cased to PascalCase** (`Timestamp`/`Value`/`Note`/`Source`); v5 uses `PropertyNamingPolicy = null`. `Source` must be an `OffsetSource` enum name.
5. **`getHistoricalValueOperations` / `startHistoricalValueOperation`** — response model changed: `CreatedOn`/`CreatedBy`/`ChangedOn`/`ChangedBy`/`Timezone` replaced by `UserId`/`StartedOn`/`StoppedOn`, plus new `Progress`/`IsUndoable`/`IsRedoable`/`LiveOperationId`/`Layer`/`ErrorMessage`. `Status` enum narrows to `Pending|Completed|Failed`.
6. **All `ValueQuery`-based historian calls** — drop the obsolete `MinMaxInterval` field (keep `MinMaxIntervalType`); optionally adopt the new `Reference` and `LimitDbHours`.
7. **`getNearestValue`** — returns a full `MeasuredValue`; the declared `& {Value: number}` is wrong (`Value` is free-form `object`).
8. **`deleteCounterOffsets`** — now returns a `bool` body (declared `void`).
9. **`sendDatSrcConfiguration`** — now returns `{JobId, Timestamp}`; also fix the missing `await` on `_getDriverUrl()`.
10. **`browseConnection`** — response can be narrowed from `any` to `{description, address, expandable, selectable}[]`.
11. **`LiveValueService`** — `SubscribeMany` now **silently drops** ACL-denied ids, so `_subscribedIds` can hold ids that never emit; `subscribeToTimestamp` must prefix ids (`T:`/`TC:`) or they are denied; `quality` is only present on `S:` packages; consider wiring `UnSubscribeMany` (currently `_unsubscribeIds` never tells the server).
12. **Error handling everywhere** — see (5).

### (4) Calls with no v5 equivalent found / no working legacy path

- **`setCustomOffset`** (`POST .../offsets/custom`) and **`deleteCustomOffsets`** (`POST .../offsets/custom/remove`): the v5 endpoints exist, but **no legacy rewrite covers them** — the Historian catch-all sends them to a non-existent `/api/v1/historian/value/counter/...` and they **404 today**. Must be repointed.
- **`queryConfiguration` via the legacy URL**: the rewrite fires but the target route serves no POST/GET -> 405/404. The 62 `/query` and 56 `/path-query` legacy rules are the only structurally dead rewrites.
- **The six `alarming`/`maintenance`/`runtime`-prefixed entity types** (Recipient, RecipientGroup, AlarmingPlan, MaintenanceService, TaskDefinition, RuntimeScript): audako-core's spelling does not match the rewriter's `alarm`/`maint`/`runti` matchers -> no rewrite coverage.
- `path-query` was **removed outright** (commit `1a21be3fa`, path is now denormalized onto the entity). audako-core does not call it, so no action — but note `Path` now arrives on the entity directly.
- Everything else in audako-core has a working v5 successor.

### (5) HttpConfig / version endpoint / error-shape findings

**HttpConfig / `application.config`.** Top-level shape is unchanged (`Services` + `Authentication` + `Configuration`), and it is still served at `{systemUrl}/assets/conf/application.config`. Canonical file:
`/home/dev/src/audako/ui/src/assets/conf/application.config`.

```json
{ "Services": { "BaseUri": "http://host/api", "Structure": "/v1/structure", "Driver": "/v1/driver",
                "Live": "/live", "Historian": "/v1/historian", "Maintenance": "/maintenance",
                "Event": "/v1/event", "Camera": "/v1/camera", "Reporting": "/v1/reporting",
                "Messenger": "/messenger", "Ticket": "/tickets", "Calendar": "/v1/calendar",
                "Manufacturing": "/manufacturing", "Runtime": "/runtime", "ExternalApi": "/ext" },
  "Authentication": { "BaseUri": "...", "ClientId": "webapp" },
  "Configuration": { ... } }
```

- **`BaseUri` still ends in `/api`, not `/api/v1`** — the `v1` moved into each service value. Concatenation stays `${BaseUri}${Services.X}`.
- **The migration is partial/per-service.** Only `Structure`, `Driver`, `Historian`, `Event`, `Camera`, `Reporting`, `Calendar` carry `/v1/...` at HEAD. `Live`, `Maintenance`, `Messenger`, `Ticket`, `Manufacturing`, `Runtime`, `ExternalApi` are still bare v4-style paths. **audako-core must not hardcode `/api/v1/...`** — keep reading the per-service path from config, or it will break on either side of the drip migration. This matters most for `Services.Live` (`/live`), where the hub URL still resolves only via the legacy proxy route + rewrite.
- **`lib/models/http-config.model.ts` needs updating**: add the missing **`Driver`** key (already used at runtime by `DataConnectionBrowserService` and `DataSourceHttpService` but absent from the interface), plus the new `Ticket`, `Manufacturing`, `Runtime`, `ExternalApi`; and add the `Configuration` block if any of it is needed. Nothing was removed.
- There is **no `HttpConfig` type in the v5 UI** — the equivalent is `AppConfig` in `/home/dev/src/audako/ui/src/app/core/initialization/application.config.ts`, flattened into the `APP_SETTINGS` singleton (`ui/src/app/core/config/settings.ts`, e.g. `configurationApiUrl`, `historianApiUrl`, `liveHubUrl`).
- `Authentication` also has an optional `RequireHttps` in the TS type that no config file sets.
- Do not treat `application_dev.config` as canonical — it splits `BaseUri`/service paths differently and is internally inconsistent.

**Version endpoint.** `/api/v1/structure/about/version` **exists**. Registered per service as
`app.AddServiceVersionEndpoint("api/v1/structure")` (`Services/Structure/Structure/Program.cs:280`) ->
`BuildingBlocks/MinimalApiToolkit/.../ServiceVersionEndpoints.cs`, which maps
`GET /{routePrefix}/about/version` with `.AllowAnonymous().AllowWithoutLicense()`. Same for all 13 services
(`api/v1/historian`, `api/v1/live`, `api/v1/driver`, ...). Body is a **bare string** (the assembly
`AssemblyInformationalVersion`, reformatted to `{prefix}.{date}-{suffix}`, or `"unknown"`) — not a JSON
object; read it as text. **Anonymous, so expect 200 without a token**; the `200 || 401` heuristic in
`isApiReachable` remains safe. `/api/structure/about/version` still works through the catch-all rewrite
(asserted in `Historian.Test/Endpoints/LegacyRewriteRegexTests.cs` for the historian equivalent), **but**
that legacy path also depends on the YARP `ReverseProxy:Legacy:Structure` flag; with it off the request
falls to the UI catch-all route and returns **HTML with status 200**, which would make `isApiReachable`
false-positive. Recommendation: probe `/api/v1/structure/about/version`, or use the unauthenticated
`GET /api/health/status`.

**Error shape.** v5 returns **RFC 7807 `application/problem+json`**, produced explicitly (there is no
`AddProblemDetails`/`UseExceptionHandler` in the platform) by `ResultEndpointFilter` ->
`BuildingBlocks/MinimalApiToolkit/.../ResultHandling/CustomResults.cs`, attached to every service's root
route group:

- `title` = the error **code** (e.g. `Signal.NotFound`, `Validation.General`), `detail` = description, `type` = an RFC URL keyed off `ErrorType`, `status` per error type.
- Status codes: Validation 400, Unauthorized 401, Forbidden 403, NotFound 404, Conflict 409, UnprocessableEntity 422, **Locked 423**, **DependencyFailure 502**, else 500. 404/409/422/423/502 are all new relative to v4.
- `errors` extension appears **only** for validation errors, and is an **array of `{code, description, type}`**, *not* the ASP.NET `Dictionary<string, string[]>` field map.
- **Do not rely on `traceId`** — it is not explicitly populated.
- Success path: non-null -> `200`, **null -> `204 No Content`**.
- Two non-ProblemDetails paths: JWT validation failure returns **401 with `text/plain`** containing the raw exception string; uncaught non-`Result` exceptions in Production have no handler -> bare **500 with an empty body**.
- v4 by contrast (`backend/buildingblocks/utilaspnetcore/UtilAspNetCore/ErrorHandlingMiddleware.cs`) emitted `application/json` `{"error":{"code":"<ExceptionTypeName>","message":"...","args":[...]}}` with only 400 and 500. **audako-core currently does no error parsing at all** (only `UserProfileHttpService` wraps `err.message`), so adopting `title`/`detail` is greenfield rather than a rewrite.

**Versioning / prefix convention.** No `Asp.Versioning` package or `[ApiVersion]` anywhere — `v1` is a
literal string in every route template: `MapGroup("/api/v1/{service}/{kebab-plural-resource}")`. Non-CRUD
verbs get an `operations/` segment (`.../groups/{id}/operations/top`). Not under `/api/v1`: `/api/health`,
`/api/health/status`, `/api/mqauth`, `/api/backup/*`, `/mqtt`, `/auth/*`.

**Auth and other cross-cutting headers.** Unchanged: `Authorization: Bearer <token>`, JWT validated against
Keycloak (`ValidateAudience = false`, `ValidateIssuer = true`), with a global
`FallbackPolicy = RequireAuthenticatedUser()`. **No tenant header** — tenant comes from token claims
(grep for `X-Tenant*` finds nothing outside test helpers). CORS is fully open and exposes
`Paging-Headers, Content-Disposition, Content-Type, Deprecation, Link`. Two new response headers appear on
**every legacy-URL hit**: `Deprecation: true` and `Link: <successor>; rel="successor-version"` — cheap
telemetry for finding un-migrated call sites in audako-core (log a warning whenever `Deprecation` is
present). HTTP bodies are **PascalCase** (`PropertyNamingPolicy = null`); **SignalR payloads are camelCase**
(explicitly overridden).

**Legacy rewriter mechanics.** Two layers: (a) YARP routes the pre-v1 prefixes
(`/api/structure/{**remainder}` etc., Order -8) gated by `ReverseProxy:Legacy:*` feature flags, all `true`
today (`Infrastructure/Proxy/Proxy/appsettings.json`); (b) each service's `LegacyUrlRewrites.cs`
(13 files; Structure's is 2130 lines / 559 routes) applies case-insensitive `(?i)` **verb-agnostic** regex
rewrites with `skipRemainingRules: true`, ending in a catch-all `^api/{service}(/.*)?$ -> api/v1/{service}$1`.
Verb-agnostic means a legacy `PUT` reaches the v5 `PUT`. Every file is marked
`// LEGACY URL REWRITE — remove once consumers migrated`, so this is a migration window, not a permanent
compatibility layer. (Exception: the Driver `/api/Device` routes are documented as **permanent** — edge-device
firmware has them baked in.)

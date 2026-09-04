# Wire-visible model changes in `structuremodels`, platform 4.13 – 4.15

Scope: only changes that alter the JSON shape or semantics of a model. Pure Bson/Mongo
attributes, validators, helper methods and build files are excluded (listed as "ignored"
per release for traceability).

**Attribution caveat (stated once):** services reference `structuremodels` with wildcard
versions, so a release contains whatever the model package looked like at build time. Each
commit below is attributed to the first release whose *first* build came after it; a
**hotfix build of the previous release may also contain it**. Treat the boundaries as fuzzy
by roughly one release.

---

## 4.13 — `git diff 33b1973..70934ed` (2023-10-19 … 2023-11-26)

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `EmailMessageSettings` (message line settings) | `UseStartTLS: bool` | property added | additive | **No** — no message-line/email-settings model in `lib/models/` (only `Recipient*Contact` in `entities/recipient.model.ts`) | `68e2e6f` | Plain `bool`, not `Field<T>`; defaults `false` |
| `AuditLogView` | `Id: string` | property added | additive | **No** — no audit-log model in audako-core | `ef12674` | Populated from `AuditLog.Id` in the view ctor |
| `EventDefinition` | `[CollectionVersion(1)]` → `(2)` | stored-shape version bump | semantic | Version attr not modelled in core, but affected data **is**: `ExpressionParameter.Type` in `entities/event-definition.model.ts`, enum `EventConditionSettingsType` in `entities/event-condition.model.ts` | `ac930a7` | Triggers `EventDefinitionMigrator_V2` — see migrator section |
| `TimebasedConditionSettings` | `Timezone: string` | property added | additive | **Yes** — `entities/event-condition.model.ts:123` (`public Timezone: string`) | `c77114c` | Plain `string`, no default (`null` on old docs) → consumers must treat null as "server/tenant default" |
| `RuntimeScript` | `Enabled: Field<bool>` | property added, ctor default `true` | additive (+semantic default) | **Yes** — `entities/runtime-script.model.ts` (`Enabled: Field<boolean>`, default `true`) | `42994c4`, `9d8e87f` (dup), `ee924fb` | Pre-4.13 documents have no `Enabled` → deserialises to `{Value:false}` server-side, i.e. **existing scripts read as disabled** unless backfilled. Core mirrors the `true` ctor default |
| `Timezones` (static table) | `WIB` = "Western Indonesian Time" / `Asia/Jakarta` | enum-like value added | additive | **No** — no timezone table in audako-core | `96cad6c` | Value space of any `Timezone` string field widens |

Ignored (no JSON impact): `AuditLog._t` `[BsonIgnore]` (`5117d9b`, Bson only — `_t` still
serialises to JSON), `TimebasedConditionSettings` `[BsonIgnoreExtraElements]` (`cc400ab`),
`MessageLineSettings : ICloneable` + `Clone()` (`63c52b4` — `MemberwiseClone`, no members
added), `EventCondition.cs` whitespace/formatting.

---

## 4.14 — `git diff 70934ed..63da416` (2023-12-19 … 2024-04-05)

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `DataConnectionType` | `Mqtt` | enum value added | additive | **Yes** — `entities/data-connection.model.ts:23` (`Mqtt = 'Mqtt'`) | `591edfb` | New discriminating type for `DataConnection.Type` |
| `DataConnectionMqttSettings` | new sub-type of `DataConnectionTypedSettings` with `Url`, `Username`, `Password` (all `Field<string>`) | new discriminated sub-type | structural (additive at wire level) | **Yes** — `entities/data-connection.model.ts:294` with identical members and `_t = 'DataConnectionMqttSettings'` | `15d94e9` | `[JsonSubClassConverter]` hierarchy → new `_t` value `DataConnectionMqttSettings`; a client that switches exhaustively on `_t` fails on older lib versions |
| `AuditOperationLog` | `Metadata: Dictionary<string,string>` public **field → property** | now serialised | structural | **No** — no audit/operation-log model in audako-core | `ebfd2ed` | Public fields are not serialised by Newtonsoft/STJ; as a property `Metadata` **appears in JSON for the first time**. Commit msg: "fix: serialization for operation log" |
| `Timezones` (static table) | `GST` = "Gulf Standard Time" / `Asia/Dubai` | enum-like value added | additive | **No** | `6ea0711` | |
| `ProcessImageUploadFileAction` base-tag whitelist | `audako-value-signal` added to accepted animation base tags | allowed-value list extended | additive (semantic) | **No** — `entities/process-image.model.ts` does not carry the base-tag whitelist | `bef36fa` | Server-side accepted-content change: process images using `audako-value-signal` are rejected by <4.14 |

Ignored: `Signal.TryGetColor()` helper reading `AdditionalFields["Color"]` (`63da416`) —
helper only, no new property; `Signal.IsCounter/IsOutput/IsInput/isVirtual` helpers
(`70934ed`, boundary commit).

---

## 4.15 — `git diff 63da416..6d1f906` (2024-05-21 … 2024-06-19)

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `DashboardTab` | `MasterTabId: Field<string>` | property added | additive | **Yes** — `entities/dashboard-tab.model.ts` | `b787315` (`[Relation(typeof(DashboardTab))]` added `5d5b9b3`) | Master/linked-tab feature; `Relation` affects delete/copy semantics server-side, not JSON |
| `DashboardTab` | `PlaceholderDefinition: Field<List<DashboardTabPlaceholder>>` | property added | additive | **Yes** — same file | `b787315` | New nested type `DashboardTabPlaceholder` |
| `DashboardTab` | `PlaceholderValues: Field<Dictionary<string,string>>` | property added | additive | **Yes** — same file | `b787315` | |
| `DashboardTab` | `EntityMapping: Field<Dictionary<string,string>>` | added then **removed inside the same range** | removed (net: none) | No (core has only `EntityMappings`) | added `b787315`, removed `9f43713` | Net-zero across the range, but an early/hotfix 4.15 build can carry `EntityMapping` (singular, `string→string`). Distinct from `EntityMappings` below |
| `DashboardTab` | `EntityMappings: Field<Dictionary<string, DashboardTabEntity>>` | property added | additive / structural | **Yes** — `entities/dashboard-tab.model.ts` (`EntityMappings: Field<{[key:string]: DashboardTabEntity}>`) | `16b4fc6` | Replaces the removed `EntityMapping`; value type is an object, not a string |
| `DashboardTabPlaceholder` | new type: `Name`, `DefaultValue` (plain strings) | new sub-type | structural (additive) | **Yes** — same file | `b787315` | Not polymorphic, no `_t` |
| `DashboardTabPlaceholder` | `PropertyId: string` | property added | additive | **Yes** — same file | `cef84de` | Added mid-range; builds between `b787315` and `cef84de` lack it |
| `DashboardTabEntity` | new type: `Id`/`EntityId` + `Type` (plain strings) | new sub-type | structural (additive) | **Yes** — same file (`EntityId`, `Type`) | `16b4fc6` | |
| `DashboardTabEntity` | `Id` → `EntityId` | property renamed | rename | **Yes** — core has the post-rename name `EntityId` | `6d1f906` | Rename happened **within** the 4.15 range (2024-06-18 → 2024-06-19). Early 4.15 builds / a 4.14 hotfix built in that window serialise `Id`; stored documents written then keep `Id` and are silently dropped afterwards |
| `FormulaIntervalSettings` | `ProvideLastValues: Field<bool>` | property added | additive | **Yes** — `entities/formula.model.ts:73`, default `false` | `9d006e5` | Added without ctor initialisation → `null` field in that build |
| `FormulaIntervalSettings` | `ProvideLastValues` ctor default `false` | default changed (`null` → `{Value:false}`) | semantic | **Yes** — core initialises `new Field<boolean>(false)` | `a235ba6` | Same-day follow-up to `9d006e5`; matters only for objects created by the platform, `null` vs `false` for consumers that distinguish |

Ignored: `4b286c0` (typo, no member change).

---

## Structure-service migrator: `EventMigrator_V2.cs`

Location `/home/dev/src/audako/backend/structure/Migration/EventMigrator_V2.cs`
(class `EventDefinitionMigrator_V2`, added `08514e8`, 2023-10-26 — the same day as the
`CollectionVersion(1)→(2)` bump `ac930a7` in `Base/Event/EventDefinition.cs`, so it lands in
**4.13**). Attribute `[Migrator(typeof(EventDefinition), 1)]` = migrate stored version 1 → 2.

What it changes: it walks every `EventDefinition`, iterates
`ExpressionParameters[]` and rewrites `Type.Value` in place (`$set` of the whole
`ExpressionParameters` array) from the short parameter names written by
`EventDefinitionMigrator_V1` to the concrete `ConditionSettings` class names used as the
`_t` discriminator:

```
SignalCondition                 -> SignalConditionSettings
CounterCondition                -> CounterConditionSettings
DataSourceFailureCondition      -> ConnectionFailureConditionSettings
DataConnectionFailureCondition  -> DataConnectionFailure
RecordingFailureCondition       -> RecordingFailureMonitoringSettings
ChangeRateMonitoring            -> ChangeRateMonitoringSettings
MaximumMonitoring               -> MaximumMonitoringSettings
MinimumMonitoring               -> MinimumMonitoringSettings
PeriodMaximumMonitoring         -> PeriodMaximumMonitoringSettings
PlausibilityMonitoring          -> PlausibilityMonitoringSettings
PositionMonitoring              -> PositionMonitoringSettings
DifferenceMonitoring            -> DifferenceMonitoringSettings
TimebasedCondition              -> TimebasedConditionSettings
```

Wire consequence: `EventDefinition.ExpressionParameters[].Type.Value` (a `Field<string>`,
no schema change) changes **value semantics** — after 4.13 it equals the condition's
`_t`, so a client can join a parameter to its `EventCondition.Settings._t` directly. Note
the mapping is not uniformly "+Settings": `DataSourceFailureCondition` becomes
`ConnectionFailureConditionSettings` and `DataConnectionFailureCondition` becomes
`DataConnectionFailure` (no suffix).

audako-core impact: `EventConditionSettingsType` in
`/home/dev/src/github/audako-core/lib/models/entities/event-condition.model.ts` already
contains exactly the post-migration names (including the two irregular ones), and
`ExpressionParameter.Type` is `Field<string>`
(`/home/dev/src/github/audako-core/lib/models/entities/event-definition.model.ts`). So core
implicitly assumes a **migrated (>= 4.13)** database. Against a 4.12 tenant, or any tenant
whose migration has not run, `Type.Value` still carries the old short names and will not
match `EventConditionSettingsType` — the only place in 4.13–4.15 where core needs a value
mapping rather than a shape mapping.

---

## Summary for adapters

Taking the newest shape as canonical, almost everything in 4.13–4.15 is **additive-only**
and needs no adapter — a client just tolerates missing properties on older servers:
`EmailMessageSettings.UseStartTLS`, `AuditLogView.Id`,
`TimebasedConditionSettings.Timezone`, `RuntimeScript.Enabled`, the `WIB`/`GST` timezone
entries, `DataConnectionType.Mqtt` + `DataConnectionMqttSettings`,
`AuditOperationLog.Metadata`, the `audako-value-signal` base tag, all four new
`DashboardTab` properties with `DashboardTabPlaceholder`/`DashboardTabEntity`,
`DashboardTabPlaceholder.PropertyId` and `FormulaIntervalSettings.ProvideLastValues`. For
sending data the same holds in reverse: extra unknown properties are dropped by pre-4.15
servers, so writing `EntityMappings`/`PlaceholderValues` against a 4.13/4.14 backend
silently loses them — worth a capability check rather than an adapter.

Three items do need real adapter logic. (1) `EventDefinition.ExpressionParameters[].Type` —
a value mapping from the pre-4.13 short names to the `*Settings` names (with the two
irregular cases), needed for 4.12 or unmigrated tenants; core's enum only knows the new
names. (2) `DashboardTabEntity.Id` → `EntityId` — a genuine rename that occurred *inside*
the 4.15 window, so both spellings can exist in stored tab documents; read both, write
`EntityId`. (3) The short-lived `DashboardTab.EntityMapping` (`Dictionary<string,string>`)
from early 4.15 builds, which is not the same field as `EntityMappings`
(`Dictionary<string, DashboardTabEntity>`) and must not be mapped onto it structurally —
if it appears, it can be ignored or lifted into `EntityMappings` by treating the string as
`EntityId` with unknown `Type`. Finally, two semantic defaults deserve care rather than an
adapter: `RuntimeScript.Enabled` is absent on pre-4.13 documents and therefore reads as
`false` (existing scripts appear disabled), and `ProvideLastValues` is `null` in the
earliest 4.15 builds rather than `false`.

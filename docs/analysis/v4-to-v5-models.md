# audako StructureModels: v4 (final) → v5 wire diff

Sources
- v4: `/home/dev/src/audako/backend/buildingblocks/structuremodels` @ `989b4b4` (final v4 state)
- v5: `/home/dev/src/audako/platform/BuildingBlocks/StructureModels` @ working tree = `6eff8d4bc`
  (branch `mh/f-3366-tenant-sip`, i.e. **PR 25, not merged**). `next` and `master` were also
  inspected, because the checked-out branch is both ahead of and behind `next`.
- Client: `/home/dev/src/github/audako-core/lib/models/`

Method: `diff -r` of the two trees (excluding bin/obj/csproj/nuspec) plus a declaration-level
extraction diff, then per-hunk interpretation. Bson attributes, `[Relation]`/`[RelationWrapped]`
attributes, validators, helper/async signature changes, namespace style and formatting are
excluded unless they change JSON.

## JSON naming policy / serializer (baseline check)

**Confirmed: v4 is also PascalCase.** Both versions set `PropertyNamingPolicy = null` and
`DictionaryKeyPolicy = null`, both add `JsonStringEnumConverter` (enums are strings on the wire in
both), both use `JsonNumberHandling.AllowNamedFloatingPointLiterals | AllowReadingFromString`,
both use the `_t` discriminator via `JsonSubClassConverterFactory("_t")`.

- v4: `backend/buildingblocks/utilaspnetcore/UtilAspNetCore/JsonTools.cs`
- v5: `platform/BuildingBlocks/MinimalApiToolkit/MinimalApiToolkit/Json/ServiceCollectionExtensions.cs`

v5 additionally registers `ResultJsonConverterFactory`, `JsonObjectIdConverter`,
`JsonObjectToInferredTypesConverter` and `PermissiveDateTimeConverter` in the *minimal-API* toolkit
(v4's minimal-API toolkit had only the string-enum + inferred-types converters; v4's MVC path had
`_t` and ObjectId). Net effect on the client: identical naming/enum encoding, v5 is *more* lenient
on inbound date parsing. **No adapter work.**

`Field<T>` and `TranslatableField<T>` (`Base/Field.cs`, `Base/TranslatableField.cs`) are
**byte-identical** between v4 and v5. No `TranslatedValue` was added to the wire (explicitly
rejected in `docs/entity-query-translated-names.md` decision 1 — the `$addFields TranslatedValue`
stage is filter/sort-only and dropped on deserialization). **No adapter work.**

## Diff table

| Entity | Property/Type | v4 | v5 | Class | In audako-core? (file) | Adapter action |
|---|---|---|---|---|---|---|
| `ConfigurationEntity` (all entities) | `Path` | no CLR property; the path array was injected into query responses by the aggregation (`$project { Entity, Path }`) — already part of the "frozen query wire" | real CLR property `List<string> Path`, `[BsonIgnore]` + `[JsonIgnore(WhenWritingNull)]`; hydrated on query rows, omitted on create/update/GET-by-id; client-sent values are discarded server-side (`EntityWritePayload.DiscardClientPath`) | structural (no visible change) | yes — `Path: string[]` (`lib/models/entities/configuration-entity.model.ts`) | none. Both versions emit `Path` on `/query` and omit it elsewhere. `toWire`: strip `Path` on writes (v4 ignores it too, v5 discards it) |
| `ConfigurationEntity` (all entities) | `AclAllow`, `AclDeny` | — | `List<string>`, both `[JsonIgnore]` (server-owned, never serialized) | additive, not wire-visible | no | none |
| `IConfigurationEntity` | `Path`, `AclAllow`, `AclDeny` | — | added to the interface | structural | n/a | none |
| all entities (query responses only) | serialization semantics | `/query` went through `ExpandoObject`: only fields present in the stored document appeared; unknown legacy stored fields were passed through; member order = document order | typed `T` serialization (consolidation slice 13): **every CLR property is emitted** (fields missing from old documents come back as `null`/default instead of being absent), stored legacy fields with no CLR property **disappear**, JSON member order = CLR declaration order | semantic | affects every `lib/models/entities/*.model.ts` | `fromWire` (v4): treat every property as possibly-absent and apply the same defaults the v5 constructor would (the TS constructors already do this via `Object.assign` over a fully-initialised instance). Do **not** rely on presence/absence as a signal. `toWire`: nothing |
| all entities (query responses only) | projection handling | DB-side `$project` fallback honoured nested/dotted projections | slice 15: boundary-inexpressible projections are **ignored**, full documents are returned (garbage projections: 500 → 200 + full document) | semantic | projection helpers in `lib/services/*` | none for models; a client must not assume a requested nested projection was applied |
| all entities | nested polymorphic payloads | `_t` emitted | `_t` emitted; a stored document whose nested `_t` no longer resolves now **fails** the typed query instead of passing through raw | semantic | `_t`-tagged sub-models (conditions, triggers, monitoring settings, contacts, message settings) | none (v5 is stricter server-side only) |
| `Storage` | **whole entity** | `Storage : ConfigurationEntity` with `EntityId`, `FileEntries`, `PrimitvEntries`; `EntityType.Storage`, endpoint `/base/Storage`, full generic entity CRUD | **removed from StructureModels on `next`** (`Base/Storage.cs` deleted, `FileEntry` deleted). Replaced by service-local, non-`ConfigurationEntity` `DashboardTabStorage` (`Services/Structure/.../Features/DashboardTab/Models/DashboardTabStorage.cs`): `Id`, `DashboardTabId`, `PrimitiveEntries`, `CreatedOn`, `ChangedOn?`. Reachable only via `/api/v1/structure/dashboard-tabs/storage/*`, authorized against the tab | removed + structural + rename | **yes** — `lib/models/entities/storage.model.ts`, `EntityType.Storage` + `EntityHttpEndpoints.Storage` (`configuration-entity.model.ts`), `EntityTypeClassMapping` (`entity-type-class-mapping.ts`) | **largest item.** Canonical model becomes `DashboardTabStorage` (no `ConfigurationEntity` base, no `Name`/`GroupId`/`Path`/`Tags`). v4 adapter: map `EntityId` ↔ `DashboardTabId`, `PrimitvEntries` ↔ `PrimitiveEntries` (typo fixed), drop `FileEntries`/`FileEntry` (never worked), synthesize the `ConfigurationEntity` base fields as empty on `fromWire` and drop them on `toWire`. Also needs separate v4/v5 endpoint routing (generic entity CRUD vs. the 3 dashboard-tab storage endpoints) |
| `Storage` | `EntityId` | `string` | renamed to `DashboardTabId` | rename | yes (`storage.model.ts`) | `fromWire`/`toWire`: rename |
| `Storage` | `PrimitvEntries` | `Dictionary<string, StorageEntry<string>>` | `PrimitiveEntries` | rename | yes (`storage.model.ts`) | `fromWire`/`toWire`: rename |
| `Storage` | `FileEntries`, `FileEntry` | present (upload always returned 400) | removed | removed | yes (`storage.model.ts` — `FileEntries`, `FileEntry`) | drop from the canonical model; `fromWire` (v4): ignore |
| `Storage` | `GroupId` | inherited, stored | dropped | removed | inherited in TS | none (v4 value ignored) |
| `StorageEntry<T>` | — | `AccessId`, `Entry` | unchanged (kept in `Base/StorageEntry.cs`) | — | yes (`storage.model.ts`) | none |
| `EventCategory` | `Acknowledgment` | — | `Field<bool> Acknowledgment` (alongside the existing `RequiresAcknowledgment`) | additive | **no** — `lib/models/entities/event-category.model.ts` has only `RequiresAcknowledgment` | add `Acknowledgment: Field<boolean>` to the v5 canonical model. v4 adapter: `fromWire` → omit/leave `undefined`; `toWire` → drop the property (v4 rejects/ignores unknown fields per its own typed binding) |
| `AuditLog` / `EntityBasedAuditLog` | `OperationId` | — | `string OperationId` on `EntityBasedAuditLog` (ties cascade-delete entries to their operation) | additive | no audit-log model in `lib/models/` (audit log surfaces via `lib/models/widgets/widget-audit-log-list-config.ts` only) | none today; add when an audit-log model is introduced. v4: absent |
| `AuditLogView` | `OperationId` | — | `string` | additive | no | none / `fromWire` v4 → `undefined` |
| `AuditLogView` | `RestoreEntryPoint` | — | `bool` | additive | no | none / `fromWire` v4 → `false` |
| `AuditLog` (base) | `IsInternal` | — | `bool` — present on **`next`**, *not* in the checked-out PR-25 tree | additive (in flux) | no | none |
| `MessageTemplate` | `_t` | no discriminator (concrete, non-polymorphic class) | `[JsonSubClassConverter]` + `public virtual string _t => GetType().Name` — templates are now polymorphic | structural | no dedicated model; `MessageTemplate` ids are referenced from `lib/models/entities/recipient*.model.ts` | if a `MessageTemplate` model is added, treat it as a `_t` union. `fromWire` (v4): default `_t = 'MessageTemplate'` |
| `MessageTemplate` → `VoipMessageTemplate` | new subtype | — | `VoipMessageTemplate : MessageTemplate` + `GreetingText`, `MessageCountText`, `MessageCountPluralText`, `MessageText`, `AdditionalMessageCountText`, `AdditionalMessageCountPluralText`, `MenuText`, `FarewellText` | additive + structural (**in flux, PR 25**) | no | none yet |
| `VoipMessageSettings` | `OutboundProxy`, `Username`, `CallerId`, `Language`, `VoiceByLanguage` | — | `string`, `string`, `string`, `string`, `Dictionary<string,string>` (default `{}`) | additive (**in flux, PR 25**) | no message-line-settings model in `lib/models/` | none today |
| `VoipMessageSettings` | obfuscation | `Password` → `"***"` | `Password` → `"***"`; when viewed from a sub-tenant (`ObfuscateInherited`) also `VoipID` and `Username` → `"***"` | semantic (**in flux, PR 25**) | no | if message lines are modelled: never round-trip `"***"` back as a real value (v5 restores the stored value on write; v4 does the same for `Password` only) |
| `MessageLineSettings` | `OBFUSCATION_MASK` | literal `"***"` inline | `public const string OBFUSCATION_MASK = "***"` (+ `ObfuscateInherited()` virtual) | none (constant, not a property) | no | none |
| `VoipSystemSettings` | **new type** | — | new model: `Id` (singleton `000000000000000000000001`), `ExternalIp`, `MaxConcurrentCalls`, `DisabledVoiceIds` | additive (**in flux, PR 25**) | no | none today |
| `SearchEntry` | **whole type** | `Id`, `ResourceId`, `Type`, `Title`, `FullText`, `AdditonalFields`, `LastIndexed` | **removed** (`refactor(structure)!: remove full-text search feature`) | removed | no | none. Any `/search` client code must be v4-only |
| `FormulaTemplate` | **whole type** | `TranslatableField<string> Name`/`Description`, `TenantId`, `Variables`, 9 × `FormulaIntervalSettings` (`ProcessInterval…YearInterval`) | **removed** | removed | no (`lib/models/entities/formula.model.ts` models `Formula` only) | none |
| `ConfigurationOperationConstants` | `TenantManagement` | `"TenantManagement"` | **removed** | removed | not in `lib/models/`; check ACL/permission string constants elsewhere in audako-core | if a permission enum exists, keep `TenantManagement` as a v4-only value |
| `IntervalType` | enum location | `Base/IntervalTypes.cs` (StructureModels) | moved to `BuildingBlocks/CommonModels/CommonModels/Domain/IntervalType.cs`; identical members | structural (assembly move only) | yes, as `CompressionInterval` (`lib/models/historical-value.model.ts`) | none — same string values on the wire |
| `ValueObjectType` | enum location | `Base/ValueObjectType.cs` (StructureModels), members `Signal`, `Formula` | moved to `CommonModels/Domain/ValueObjectType.cs`; identical members | structural (assembly move only) | yes, `ValueObjectType = EntityType.Signal \| EntityType.Formula` (`lib/models/historical-value.model.ts`) | none |
| `PathLookupResult` | **new type** | `bool PathExists(name, out id, out type)` | `PathLookupResult { Found, Id, Type }` returned by `ISimplifiedPathService.FindPathAsync` | additive, server-internal | no | none |
| `AclTokens` | **new static helper** | — | `Base/AclTokens.cs` (token build/probe/`IsGranted`) | additive, not wire | no | none |
| `RelationWrappedAttribute` | `OwnVariant` | — | `Type OwnVariant` | additive, not wire | no | none |
| `Report.ReportObject.ObjectId` | relation metadata | `[RelationWrapped(Report,"Objects",Signal/Formula)]` | attributes removed | none (attribute only) | yes (`lib/models/entities/report.model.ts`) | none |
| `SwitchSchedule.SwitchRule.SignalId`, `EventDefinition.ExpressionParameter.ConditionId`, `CounterConditionSettings.SignalId`, `MaintenanceService.Trigger`/`MaintenanceTasks`, `TaskDefinition.AssignedDocuments`, `SignalbaseServiceConditionSettings.*`, `TimebasedServiceConditionSettings.ServiceId`, `RuntimeScript` triggers, `DifferenceMonitoringSettings.ObjectSettings.ObjectId`, `RecipientContact.MessageLine`/`MessageTemplate`, `Storage.EntityId` | relation metadata | mostly none | `[Relation]` / `[RelationWrapped]` added or refined (`Settings.CompareObject_A/_B` with `OwnVariant`) | none (attributes only) | the properties exist in `lib/models/entities/*.model.ts` | none |
| `Path` (the `Base/Path.cs` resource document) | — | `PathString`, `PathNameString` + `[BsonIgnore]` computed lists | unchanged shape; only `[CollectionVersion(1)]` added | none | no | none |
| `Tenant`, `TenantUserRights`, `Contract`, `Synchronization`, `BackupDefinition`, `Tag`, `CustomMapping`, `ShortLinkDefinition`, `KeyFileView`, `TenantBluePrintSettings` | — | — | **files byte-identical** | none | yes (`lib/models/tenant-view.model.ts`) | none |
| `User`, `UserProfile`, `UserView` | — | — | **files byte-identical** | yes (`lib/models/entities/user.model.ts`, `lib/models/user-profile.model.ts`) | none |
| `Signal`, `Formula`, `DataSource`, `DataConnection`, `Connector`, `Group`, `Dashboard`, `DashboardTab`, `Document`, `Camera`, `ProcessImage`, `Report`, `ReportTemplate`, `BatchDefinition`, `SwitchSchedule`, `Role`, `Recipient`, `RecipientGroup`, `AlarmingPlan`, `MaintenanceService`, `TaskDefinition`, `RuntimeScript`, `EventCondition`, `EventDefinition`, `Pool`, `File`, `Manifest`, `Property`, `CustomFieldSettings`, `ExternalApi`, `Statistics` | — | — | **no wire-visible property/type/enum/default change** (only attributes, async signatures, `string`-keyword style, file-scoped namespaces) | none | yes, most of them | none |
| `HistoricalValue*` | — | not in StructureModels (historian service contracts) | not in StructureModels | n/a | `lib/models/historical-value.model.ts`, `historical-value-operation.model.ts` | out of scope for this diff — compare against the historian service contracts separately |

## Summary

### 1. Overall verdict: the models barely diverged

For 27 of the ~29 entity types audako-core models, the v4 and v5 CLR shapes are **identical on the
wire**. The entire declaration-level diff of the two trees is ~330 lines, and the large majority of
it is `[Relation]`/`[RelationWrapped]` metadata, `async`/`CancellationToken` signature churn,
file-scoped namespaces and `String` → `string`. Naming policy, enum encoding, number handling, the
`_t` discriminator mechanism and both field wrappers (`Field<T>`, `TranslatableField<T>`) are
unchanged.

The real divergence is in **three** places, only one of which is a hard break:

1. **`Storage` is gone** (hard break, `next`). It stops being a `ConfigurationEntity` and becomes a
   service-local `DashboardTabStorage` with two renamed properties (`EntityId` → `DashboardTabId`,
   `PrimitvEntries` → `PrimitiveEntries`), no `FileEntries`, and a different endpoint family.
2. **Query response semantics** (soft, whole-surface). v5 serializes typed CLR objects, so on
   `/query` every property is present (nulls/defaults instead of absent keys), legacy stored fields
   vanish, and unexpressible projections are ignored rather than applied. A client that treats
   absent ≡ default is unaffected; one that branches on key presence is.
3. **A handful of additive properties**: `EventCategory.Acknowledgment`,
   `AuditLog.OperationId` / `AuditLogView.OperationId` + `RestoreEntryPoint`, plus the
   still-unmerged VoIP set.

Removals are all in areas audako-core does not model: `SearchEntry` (full-text search removed),
`FormulaTemplate`, `ConfigurationOperationConstants.TenantManagement`. `IntervalType` and
`ValueObjectType` only changed assembly, not wire.

### 2. Entities that need a v4 adapter

- **`Storage` / `DashboardTabStorage`** — the only entity needing real bidirectional field mapping
  (rename `EntityId`/`PrimitvEntries`, drop `FileEntries` + `ConfigurationEntity` base fields) *and*
  endpoint routing. Files: `lib/models/entities/storage.model.ts`,
  `lib/models/entities/configuration-entity.model.ts` (`EntityType.Storage`,
  `EntityHttpEndpoints.Storage`), `lib/models/entity-type-class-mapping.ts`.
- **`EventCategory`** — trivial: strip `Acknowledgment` on `toWire`, tolerate its absence on
  `fromWire`. File: `lib/models/entities/event-category.model.ts`.
- **All entities, generic (not per-entity)** — one shared "fill defaults for absent keys" pass in
  `fromWire` for v4 query results, and a shared `toWire` that strips server-owned/v5-only keys
  (`Path`, `AclAllow`, `AclDeny`). This belongs in the base `ConfigurationEntity` adapter, not in
   per-entity code.
- **Nothing needed** for: `Tenant`/`TenantView`, `User`, `UserProfile`, `Signal`, `Formula`,
  `DataSource`, `DataConnection`, `Connector`, `Group`, `Dashboard`, `DashboardTab`, `Document`,
  `Camera`, `ProcessImage`, `Report`, `ReportTemplate`, `BatchDefinition`, `SwitchSchedule`,
  `Role`, `Recipient`, `RecipientGroup`, `AlarmingPlan`, `MaintenanceService`, `TaskDefinition`,
  `RuntimeScript`, `EventCondition`, `EventDefinition`, `Field<T>`, `TranslatableField<T>`.
- **v4-only surfaces** (no v5 counterpart, must be feature-gated rather than adapted): full-text
  search (`SearchEntry`), `FormulaTemplate`, the `TenantManagement` ACL operation, the generic
  `/base/Storage` CRUD endpoints.

### 3. Still in flux in v5 (per git log)

- The inspected v5 tree is `mh/f-3366-tenant-sip` = **origin/pr-25, not merged into `next`**.
  Everything VoIP-shaped is therefore unstable: `Messaging/VoipSystemSettings.cs` (new),
  `VoipMessageSettings` (+`OutboundProxy`, `Username`, `CallerId`, `Language`, `VoiceByLanguage`,
  `ObfuscateInherited`), `MessageTemplate` becoming polymorphic (`_t`) with the
  `VoipMessageTemplate` subtype, `MessageLineSettings.OBFUSCATION_MASK`, and the
  `RecipientContact` relation metadata. The branch history even contains a
  `revert(structure): drop the voip system settings migrator` and a
  `refactor(structure): move the voip texts onto a template subtype` — the template-subtype design
  landed late and could still move. **Do not model these in audako-core yet.**
- Conversely the inspected tree is **behind `next`** on two merged items, so the true v5 target is:
  - `Base/Storage.cs` **deleted** (`DashboardTabStorage`, `PrimitiveEntries`,
    `DashboardTabStorageMigrator_V1`) — implemented on `next`, still present in the inspected tree.
    Treat "Storage removed" as decided.
  - `AuditLog.IsInternal` (`bool`) — on `next`, absent from the inspected tree.
- Documented-but-explicitly-deferred, i.e. plausible near-future additive wire changes:
  - `TranslatableField<T>.TranslatedValue` on responses (the `Path` pattern: `[BsonIgnore]` +
    `[JsonIgnore(WhenWritingNull)]`) — "a possible later additive slice", out of scope in
    `docs/entity-query-translated-names.md`. If it lands, it is additive and needs no v4 adapter
    beyond tolerating absence.
  - `ConfigurationEntity.Path` phase 2 — persisting `Path` and dropping the `$lookup`s
    (`docs/entity-path-denormalization.md`). Wire-neutral.

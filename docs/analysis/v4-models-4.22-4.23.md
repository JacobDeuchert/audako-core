# audako v4 wire-visible model changes: 4.22 and 4.23

Source: `/home/dev/src/audako/backend/buildingblocks/structuremodels` (read-only, master).
Client: `/home/dev/src/github/audako-core/lib/models/`.

**Attribution caveat (stated once):** services reference `Audako.StructureModels` with wildcard versions, so a
release contains whatever model state existed when its services were built. A commit is attributed here to the
first release whose first build came after it, but **hotfix builds of the previous release may also pick the change
up** — e.g. a 4.21.x hotfix built after 2025-11-09 already carries `ConfigurationEntity.Tags`/`Alias`. Treat the
release boundaries as "no later than", not "exactly".

Verification of the late-2025 items requested: `Tag` model (9ca49e1, 2025-11-09), `ConfigurationEntity.Tags`
(53a348a, 2025-11-09), `ConfigurationEntity.Alias` (da8d8f5, 2025-11-13), `CustomMapping` (c892e1b, 2025-11-17)
are **all inside the 4.22 range** (`4ec211d..71e26b0`), not earlier and not in 4.23.
The Manifest "rename properties to Upgrade" (8cc3b1c, 2026-04-28) is in the **4.23** range.

---

## Release 4.22 — `4ec211d..71e26b0` (2025-11-09 … 2026-04-07)

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `ConfigurationEntity` (all entities) | `Tags: Field<List<string>>` | added, default `Field([])` | additive | yes — `lib/models/entities/configuration-entity.model.ts:117` | 53a348a | Wrapped value `{Value: string[]}`; appears on every entity type. |
| `ConfigurationEntity` (all entities) | `Alias: Field<string>` | added on base | additive (but see below) | yes — `configuration-entity.model.ts:114` | da8d8f5 | Pulled up from Signal/Formula. |
| `Signal` | `Alias: Field<string>` | removed from Signal (now inherited from base) | structural | yes — inherited only, no own `Alias` in `entities/signal.model.ts` | da8d8f5 | JSON property name/shape unchanged (`Alias: {Value}`) — pure code move, wire-compatible. |
| `Formula` | `Alias: Field<string>` | removed from Formula (now inherited) | structural | yes — inherited only, `entities/formula.model.ts` | da8d8f5 | Same: wire-neutral. |
| `Tag` (new document type) | whole type: `Id`, `Name`/`Description` (`TranslatableField<string>`), `TenantId`, `Icon`, `Color`, `Inheritable`, `Enabled` (default `true`), `CreatedBy/On`, `ChangedBy/On` | new entity type | additive / structural | **no** — no `tag.model.ts` in `lib/models/` | 9ca49e1, bf5fa34, c8ebcb3, 4023393 | Tenant-scoped, not a `ConfigurationEntity`. Needed if the client ever resolves tag ids to names/colors. |
| `TagScope` enum | `Global`, `Tenant`, `Group`, `GroupAndSubgroups` | new enum, moved from Formula.cs to Tag.cs | additive | yes — `entities/formula.model.ts:119` | 9ca49e1 / 6b4e480 | Namespace move only; JSON string values unchanged. |
| `FormulaVariable` | `TagScope: Field<TagScope?>` | added | additive | yes — `entities/formula.model.ts:57` | 2dc91fa | Core types it as non-nullable `Field<TagScope>` with default `Global`; server default is `Field(null)` — **minor default/nullability mismatch**. |
| `FormulaVariable` | `ObjectType`, `ObjectId` now initialized in ctor | changed default (`null` → `Field{Value:null}`) | semantic | yes — core inits both | 2dc91fa | Previously the properties could be absent/`null` object; now always an emitted `Field` wrapper. |
| `VariableType` enum | `Tag` added (after `Signal`, `Formula`) | additive | additive | yes — `entities/formula.model.ts:102` | 2dc91fa | Numeric ordinal 2; string-serialized in JSON. |
| `CustomMapping` (new document type) | `Id`, `Name`, `Description` (`TranslatableField<string>`), `TenantId`, `Inheritable`, `Mappings: Dictionary<string, object>`, audit fields | new entity type | additive / structural | **no** — no `custom-mapping.model.ts` | c892e1b, 7c0ba7a, 2d68c8d, b9f3917 | `Description` added 2d68c8d, `Inheritable` added b9f3917 — both inside 4.22 too. |
| `BatchDefinition` | `ReleaseSettings: BatchReleaseSettings` | added, default `{Enabled:false, SignalId:null}` | additive | yes — `entities/batch-definition.model.ts` (`ReleaseSettings`) | 0e3c4f0, 2c25516 | New nested object. |
| `BatchReleaseSettings` (new sub-type) | `Enabled: bool`, `SignalId: string`, `ReleaseValue: object` | new sub-type | structural | yes — `batch-definition.model.ts` `class BatchReleaseSettings` | 0e3c4f0, 3305f8e | `ReleaseValue` is untyped `object` → any JSON scalar. |
| `BatchAction` enum | `Release` added | additive | additive | yes — `batch-definition.model.ts:11` | 87349cb | Ordinal 2. |
| `MetadataField` | `OrderSpecific: bool` | added, default `false` | additive | yes — `batch-definition.model.ts` `MetadataField.OrderSpecific` | 7d5e128 | Splits general vs order-specific metadata. |
| `MetadataField` | `WritebackSignalId: string` | added | additive | yes — `MetadataField.WritebackSignalId` | 3305f8e | |
| `MetadataField` | `WritebackResetValue: object` | added | additive | yes — `MetadataField.WritebackResetValue` | 3305f8e | Untyped. |
| `MetadataFieldType` enum | `CustomMappingField` inserted **before** `UserField` | additive + semantic | semantic | yes — `batch-definition.model.ts:34`, same order | 4615247 | Insertion shifts numeric ordinals of `UserField` and the backwards-compat entries. Harmless while values serialize as strings; breaks any int-based persisted value. |
| `CustomMappingFieldSettings` (new `CustomFieldSettings` sub-type / `_t` discriminator) | `CustomMappingId: string` | new discriminated sub-type | structural | yes — `entities/custom-field-settings.model.ts:93` | 4615247 | New `_t: "CustomMappingFieldSettings"` value. |
| `ConnectorObjectType` enum | `BatchDefinition` added | additive | additive | yes — `entities/connector.model.ts:46` | c414c42 | Ordinal 4. |
| `Property` (tenant property) | `Inheritable: bool` | added, default `false` | additive | **no** — no property model in `lib/models/` | 0349751 | |
| `SMSMessageSettings` | `SMSId: string` | added | additive | **no** — messaging/message-line settings not modelled in core | 546a643 | |
| `EnteredEvent` | `Trigger: EventTrigger` | removed | removed | **no** — core has no `EnteredEvent` model (only widget configs reference the name) | 1829d6c | Dropped the `_t`-discriminated `EventTrigger`/`ConditionEventTrigger` polymorphic wrapper entirely. |
| `EnteredEvent` | `Window: List<string>` | removed | removed | no | 1829d6c | |
| `EventTrigger` / `ConditionEventTrigger` | abstract + concrete sub-type with `_t` | removed types | removed / structural | no | 1829d6c | Discriminator gone from the wire. |
| `EventReciept` (+ `EventReceiptTypes` enum: `User`,`Recipient`,`System`) | whole types | removed | removed | no | 1829d6c | Were already unused. |
| `EnteredEvent` | `NameTranslations`, `DescriptionTranslations` now initialized to `{}` | changed default (`null` → `{}`) | semantic | no | 1829d6c | Previously could be `null` in JSON. |
| `Manifest` | `License: string` | removed | removed | **no** — no manifest model in core | a3d3e3c | Migrated into `LicenseChain[0]` by `ManifestMigrator_V1`. |
| `Manifest` | `DatabaseManifests: IEnumerable<DatabaseManifest>` + `DatabaseManifest` type | removed | removed | no | a3d3e3c | |
| `Manifest` | `LicenseChain: List<string>` (default `[]`) | added | additive | no | a3d3e3c | |
| `Manifest` | `EnforcedOn: DateTime?` | added | additive | no | a3d3e3c | Set to `now + 30d` by the migrator. |
| `Manifest` | `PendingLicenseUpdateNonce: string`, `PendingLicenseUpdateCreatedOnUtc: DateTime?` | added | additive | no | 71e26b0 | **Renamed again in 4.23** — see below. |
| `Manifest` | `[CollectionVersion(1)]` | stored-shape version bump | structural | no | a3d3e3c | Triggers `ManifestMigrator_V1`. |
| `AudakoLicenseView` / `LicenseView` | entire classes removed from this package | removed (from package) | structural | **no** license-view model in core | 9b562f6 | Moved to the licensing building block. If the licensing package kept the same property names, the HTTP payload is unchanged; only the owning assembly moved. Verify against the licensing building block if the client consumes a license endpoint. |

Non-wire in this range (ignored): validators (`EmailContactValidator`, `PhoneBasedContactValidator`, deleted
`IRelationChecker`/`RelationValidator`), `[Relation…]`/`[RelationWrapped]` attributes (b401ae8 and the
`MetadataField`/`BatchReleaseSettings` ones), `ProcessImageUploadFileAction.resolveEntities` body refactor,
collection-expression rewrites of ctor defaults, Dockerfile/.NET 8/nuget/csproj/Jenkinsfile.

---

## Release 4.23 — `71e26b0..989b4b4` (2026-04-18 … 2026-06-02, master HEAD = final v4 model state)

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `EventCategory` | `Acknowledgment` → `RequiresAcknowledgment` (`Field<bool>`) | rename | rename | yes — `entities/event-category.model.ts:22` (new name only) | be777c7 | **No migrator exists** for EventCategory, so stored documents may still carry `Acknowledgment`; server just reads `null`/default. Clients talking to ≤4.22 must send/read the old name. |
| `EventCategory` | `Class` default → `Field(EventCategoryClass.Info)` | changed default | semantic | yes — same default in core | be777c7 | Previously uninitialized (`null` field object). |
| `EventCategory` | `RequiresAcknowledgment` default → `true` | changed default | semantic | yes — `true` in core | be777c7 | New entities now acknowledge-required by default. |
| `EventCategory` | `NoRepeatUntilAcknowledged` default → `Field(false)` | changed default | semantic | yes | be777c7 | Previously absent/`null`. |
| `Manifest` | `PendingLicenseUpdateNonce` → `PendingLicenseUpgradeNonce` | rename | rename | **no** manifest model in core | 8cc3b1c | Migrated by `ManifestMigrator_V2`. |
| `Manifest` | `PendingLicenseUpdateCreatedOnUtc` → `PendingLicenseUpgradeCreatedOnUtc` | rename | rename | no | 8cc3b1c | Migrated by `ManifestMigrator_V2`. |
| `Manifest` | `UpdateAvailable: bool` → `UpgradeAvailable: bool` | added then renamed **within this range** | additive + rename | no | 4e0f143 then 8cc3b1c | Added 2026-04-18 as `UpdateAvailable`, renamed 2026-04-28. Early 4.23 builds could carry the `Update` spelling. |
| `Manifest` | `SusEnabled: bool?` | added | additive | no | 63e8926 | Nullable tri-state. |
| `Manifest` | `LicenseAutoUpgradedOn: DateTime?`, `LicenseAutoUpgradeError: string` | added then removed **within this range** | additive → removed (net: absent) | no | 50a8675 then deb6cb3 (both 2026-04-29) | Net zero at HEAD, but a build from that day could expose them. |
| `Manifest` | `[CollectionVersion(1)]` → `[CollectionVersion(2)]` | stored-shape version bump | structural | no | 8cc3b1c | Triggers `ManifestMigrator_V2`. |
| `DataConnection` | `InactivityTimeout: Field<uint?>` | added, default `Field<uint?>()` | additive | yes — `entities/data-connection.model.ts:38` | 989b4b4 | Declared before `PollingInterval`; property order is not wire-significant for JSON objects. |

Non-wire in this range: whitespace/formatting in `EventCategory.cs` (`AlarmTrigger` `[Flags]` block unchanged —
`OnRaised = 1`, `OnDropped = 2`, values untouched).

---

## Structure-service migrators (stored-shape changes)

`/home/dev/src/audako/backend/structure/Migration/ManifestMigrator_V1.cs` — `[Migrator(typeof(Manifest), 0)]`,
file dated 2026-02-26, pairs with the 4.22 commit a3d3e3c. Per manifest document: if a non-empty legacy
`License` string exists, set `LicenseChain = [License]`; otherwise set `LicenseChain = []`. In both cases set
`EnforcedOn = UtcNow + 30 days` (grace period) and `$unset License`. So `Manifest.License` disappears from
storage and the wire in 4.22.

`/home/dev/src/audako/backend/structure/Migration/ManifestMigrator_V2.cs` — `[Migrator(typeof(Manifest), 1)]`,
file dated 2026-04-29, pairs with 4.23 commit 8cc3b1c. Pure field rename with copy-if-absent semantics:
`PendingLicenseUpdateNonce` → `PendingLicenseUpgradeNonce`, `PendingLicenseUpdateCreatedOnUtc` →
`PendingLicenseUpgradeCreatedOnUtc`, `UpdateAvailable` → `UpgradeAvailable`; then `$unset` all three legacy
fields unconditionally. Confirms `Update*` → `Upgrade*` is a genuine stored+wire rename, not an alias.

No migrator exists for `EventCategory.Acknowledgment` → `RequiresAcknowledgment`, nor for
`Signal.Alias`/`Formula.Alias` moving to the base class (the latter needs none — same field name and shape).
Other migrators in that directory (`BatchDefinitionMigrator_V1`, `EventMigrator_V1/V2`,
`MessageLineSettingsMigrator_V1/V2`, `RecipientMigrator_V1`) predate these ranges or belong to other
building blocks and are out of scope here.

---

## Summary for adapters

audako-core is already written against the **newest (4.23 / HEAD) shape**: `ConfigurationEntity.Tags`/`Alias`,
`BatchDefinition.ReleaseSettings` + `BatchAction.Release` + `MetadataField.OrderSpecific`/`Writeback*`,
`CustomMappingFieldSettings`, `ConnectorObjectType.BatchDefinition`, `FormulaVariable.TagScope` +
`VariableType.Tag`, `EventCategory.RequiresAcknowledgment` (with 4.23 defaults) and
`DataConnection.InactivityTimeout`. For platforms 4.12–4.21 all of those are simply **absent** from responses —
they deserialize as `undefined`, which is tolerable; the only real risk is the client *sending* them on write,
where an older server ignores unknown properties. So the whole 4.22 batch and `DataConnection.InactivityTimeout`
and the `Manifest` additions (`LicenseChain`, `EnforcedOn`, `SusEnabled`, `Upgrade*`) are **additive-only** from
the client's perspective and need no adapter.

Two changes genuinely need an adapter for the canonical-newest client. (1) **`EventCategory.Acknowledgment` →
`RequiresAcknowledgment`** — the only rename on a type audako-core actually models, with no server-side migrator,
so against 4.12–4.22 the client must map both directions (read `Acknowledgment ?? RequiresAcknowledgment`, and
write the legacy name when the target platform is <4.23). (2) **`Manifest.PendingLicenseUpdate*`/`UpdateAvailable`
→ `Upgrade*`** — a rename too, but audako-core has no manifest model; add the adapter only if manifest/licensing
endpoints are ever surfaced. Beyond that, be aware of the 4.23 `EventCategory` **default changes** (`Class = Info`,
`RequiresAcknowledgment = true`): a newly constructed core `EventCategory` posted to an older server carries
defaults that server never produced, so don't rely on "server default" round-tripping. Finally, the inserted
`MetadataFieldType.CustomMappingField` shifts enum ordinals — safe as long as serialization stays string-based,
which it currently is.

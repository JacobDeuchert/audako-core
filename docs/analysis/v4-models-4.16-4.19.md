# audako v4 wire-visible model changes, 4.16 -> 4.19

Source repo: `/home/dev/src/audako/backend/buildingblocks/structuremodels` (read-only, master).
Client repo checked: `/home/dev/src/github/audako-core/lib/models/`.

**Attribution caveat (stated once):** services reference `Audako.StructureModels` with wildcard versions, so a
release contains whatever models existed when its services were built. A commit is attributed here to the first
release whose first build came after it, but **hotfix builds of the previous release may also contain the same
change** — so any change listed under 4.17 can in practice appear in a late 4.16 hotfix, and so on.

---

## 4.16 — `git diff 6d1f906..668d56f`

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `AuditLog` | `NameTranslations: Dictionary<string,string>` | added | additive | **No** — no AuditLog model in core (only `lib/models/widgets/widget-audit-log-list-config.ts`) | `161e048` | Plain dict (not a `Field`), sits next to `Name`. Client would need a new model to consume it. |
| `AuditEntityLogAction` enum | `Delete,` trailing comma | none | — | n/a | `6d1f906..` | Cosmetic only, no wire effect. |
| `TranslatableField<T>` | `Translations` visibility `private -> public`, value type `Dictionary<string,string> -> Dictionary<string,T>` | added (effectively) + type change | structural | **Yes** — `lib/models/entities/configuration-entity.model.ts:99-106` (`Translations: {[language: string]: T}`) | `0ee34c9` | Big one: before 4.16 `Translations` was a non-public property and therefore **never serialized**. From 4.16 every `TranslatableField` on the wire (i.e. `Name`, `Description` on every `ConfigurationEntity`) gains a `Translations` object. Pre-4.16 servers ignore/omit it. Value type also generalized `string -> T`, matching core. |
| `TenantView` | `IncludesSelf: bool` | added | additive | **No** — `lib/models/tenant-view.model.ts` lacks it | `4903488` + `2c8c723` | Only populated by the `TenantView(tenant, userInfo)` ctor; other call sites emit `false`. |
| `PublicTenantView` | whole class | removed | structural | **No** — core never modelled it | `2c8c723` | Endpoints that returned `PublicTenantView` (`Id/Name/Description/IncludesSelf/ApplicationSettings/Root`) now return `TenantView`, which is a **superset** (adds `Enabled`, `Locked`, `Public`, `Position`). Verified: `structure/Features/Tenants/TenantService.UserInteraction.cs` now uses `new TenantView(tenant, userInfo)` everywhere; no `PublicTenantView` references remain. Backward-compatible for readers. |
| `ApplicationSettings` (tenant) | `Languages: List<TenantLanguage>` | added | additive | **Partly** — core types `TenantView.ApplicationSettings` as `{[p: string]: any}`, so it passes through untyped | `12750da`, `4602e00`, `8df53d2` | Default `new List<TenantLanguage>()` -> serializes as `[]` on old tenants. |
| `TenantLanguage` (new type) | `LanguageId: string`, `Name: string`, `Disabled: bool`, `Default: bool` | new sub-type | additive | No (untyped in core) | `4602e00` (+ `8df53d2` added `Name`) | Plain POCO, not `Field`-wrapped. |
| `DataConnection` | `SpecialDeviceProfile: Field<DataConnectionSpecialDeviceProfile>` | added | additive | **Yes** — `lib/models/entities/data-connection.model.ts` (with default `None`) | `7255359` | Default `Field<...>(None)`, so new payloads always carry `{Value:"None"}`; pre-4.16 payloads omit it -> clients must tolerate `undefined`. |
| `DataConnectionSpecialDeviceProfile` (new enum) | `None`, `JUMO` | new enum | additive | **Yes** — same file | `7255359` | |
| `DataConnectionOpcUaSettings` | `TimestampSource: Field<DataConnectionOpcUaTimestampSource>` | added | additive | **Yes** — same file | `7255359` (typo fix `668d56f`) | Note: **not** initialized in the C# ctor, so it serializes as `null` on new objects, unlike core which defaults it to `Connection`. Minor semantic mismatch. |
| `DataConnectionOpcUaTimestampSource` (new enum) | `Connection`, `EdgeGateway` | new enum | additive | **Yes** — same file | `7255359` | |

Also in this range but **net-zero** (added then reverted before `668d56f`): `22feb8e` "add EntityActions" reverted by `b11d457` "rm changes". No wire effect.

---

## 4.17 — `git diff 668d56f..19e8882`

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `EventDefinition` | `EventCategoryId` now initialized to `new Field<string>()` in ctor | semantic | semantic | **Yes** — `lib/models/entities/event-definition.model.ts` (also initialized) | `05e29eb` | Property already existed; before 4.17 it serialized as `null`, from 4.17 as `{Value:null,OOAttributes:[]}`. Clients doing `entity.EventCategoryId.Value` break on pre-4.17 payloads. |
| `BatchDefinition.MetadataField` | `Editable: bool` | added | additive | **Yes** — `lib/models/entities/batch-definition.model.ts:102` | `47493a6`, `d8897da` | `47493a6` first shipped a ctor default `Editable = true`; `d8897da` **removed that default** the next day, so the on-wire default is `false`. If any build sits between the two commits, new metadata fields default to `true` there. Classify the default removal as `semantic`. |
| `BatchDefinition` | `[CollectionVersion(1)]` | stored-shape version bump | semantic | Version field exists in core (`ConfigurationEntity.Version`) | `3547c00` | Triggers `BatchDefinitionMigrator_V1` — see migrator section below. Wire effect: `Version` on `BatchDefinition` documents changes `0 -> 1`. |
| `DataConnection` | `PollingInterval: Field<uint?>` | added | additive | **Yes** — `lib/models/entities/data-connection.model.ts` (`Field<number \| null>`) | `4b7455d`, nullable in `3593bbe` | Introduced non-nullable `Field<uint>` in `4b7455d`, made `Field<uint?>` a commit later — a build in between would reject/serialize `0` instead of `null`. Not ctor-initialized, so serializes as `null` on new objects. |
| `DataConnectionType` enum | `OneWire` | added | additive | **Yes** — same file | `19e8882` | Appended after `Mqtt`; ordinal-safe. |
| `DataConnectionOneWireSettings` (new sub-type) | `Host: Field<string>` (default `"localhost"`), `Port: Field<ushort>` (default `4304`) | new discriminated sub-type | additive | **Yes** — same file, identical defaults | `214cf9f` | New `_t` discriminator value `DataConnectionOneWireSettings`. Pre-4.17 servers cannot deserialize it. |
| `DataSource` | `PermaLiveModeSettings: PermaLiveModeSettings` | added | additive | **Yes** — `lib/models/entities/data-source.model.ts` | `7b4f5d0`, `50c378e` | Not ctor-initialized in C# -> `null` on new objects; core constructs it eagerly. |
| `PermaLiveModeSettings` (new type) | `Enabled: Field<bool>` (default `false`), `BlockingTime: Field<int>` (default `10`) | new sub-type | additive | **Yes** — same file, identical defaults | `7b4f5d0` | Nested object of `Field`s, no `_t`. |

Non-wire in this range: `Jenkinsfile`, `nuget.config`.

---

## 4.18 — no new model commits

**4.18 shares the exact same `structuremodels` baseline as 4.17 (`19e8882`).** There were no model commits attributed
to 4.18, so no wire-shape or semantic differences exist between 4.17 and 4.18 for these models.

---

## 4.19 — `git diff 19e8882..2ebe925`

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `BackupDefinition` (new abstract entity) | `_t`, `Id`, `TenantId`, `Enabled: bool`, `CreatedOn: DateTime`, `Name: string`, `StorageDefinitions: List<BackupStorageDefinition>`, `Schedule: BackupSchedule` | new entity type + discriminator | additive / structural | **No** — nothing in `lib/models/` | `042c51a`, `87544d6`, `7a06573`, `f80a243`, `edab289`, `5edd5f6`, `db0e233` | Not a `ConfigurationEntity`; flat POCO, **no `Field<T>` wrapping**. `_t` discriminator via `JsonSubClassConverter`. `CreatedOn` defaults to `DateTime.UtcNow`, `StorageDefinitions` to `[]`. Built incrementally: `Enabled` (`87544d6`), `CreatedOn` (`f80a243`) — a mid-4.19 build may lack them. |
| `LvmBackupDefinition` (new sub-type) | `VolumeGroup: string`, `LogicalVolume: string` | new sub-type | additive | No | `042c51a` | `_t = "LvmBackupDefinition"`. |
| `BackupSchedule` (new abstract) | `_t` | new discriminator | additive | No | `042c51a` | |
| `IntervalBackupSchedule` | `StartTime: DateTime`, `Interval: TimeSpan` | new sub-type | additive | No | `042c51a` | `TimeSpan` serializes as `"hh:mm:ss"`-style string in JSON — client must parse. |
| `RruleBackupSchedule` | `Rrule: string`, `Timezone: string` | new sub-type | additive | No | `042c51a`, `7a06573` | `Timezone` added in `7a06573`, so an early 4.19 build may emit `RruleBackupSchedule` without it. |
| `BackupStorageDefinition` (new abstract) | `_t`, `RetentionPolicy: RetentionPolicy` | new type + discriminator | additive | No | `042c51a` | |
| `S3BackupStorageDefinition` | `Endpoint`, `Port: uint`, `UseSSL: bool`, `AccessKey`, `SecretKey`, `BucketName`, `Region` | new sub-type | additive | No | `042c51a` | Secrets travel in clear on the wire. |
| `FileSystemBackupStorageDefinition` | `Path: string` | new sub-type | additive | No | `042c51a` | |
| `RetentionPolicy` / `TimeBasedRetentionPolicy` | `_t`; `RetentionPeriod: TimeSpan` | new types + discriminator | additive | No | `042c51a` | Declared in the **global namespace** (outside `Audako.Services.Structure.Model...`) — a codegen/oddity worth noting, but JSON shape is unaffected. |
| `ShortLinkDefinition` (new entity) | `Id`, `TenantId`, `CreatedOn: DateTime`, `Name: string`, `ShortLinkId: string`, `Target: ShortLinkTarget` | new entity type | additive | **No** | `942c1ba`, `00b54a0` | Flat POCO, no `Field<T>`, no `_t` on the root. `Target` added in `00b54a0`. |
| `ShortLinkTarget` (new abstract) + `DashboardTabShortLinkTarget` | `_t`; `DashboardTabId: string` | new discriminated sub-type | additive | No | `00b54a0` | |
| `SynchronizationPartner` | `AllowedEntities: IEnumerable<string>`, `BlockedEntities: IEnumerable<string>` | added | additive | **No** — no Synchronization model in core | `289c034` | |
| `SynchronizationPartner` | `SynchronizationSteps`, `ReferenceReplacements`, `Scope`, `Exclusions` now ctor-initialized to empty lists | semantic | semantic | No | `289c034` | Previously serialized as `null`; from 4.19 as `[]`. Affects consumers that distinguish null from empty. |
| `Connector.ConnectorObject` | `ObjectId` gains `[RelationWrapped(..., typeof(Group))]` | semantic | semantic | **Yes** — `lib/models/entities/connector.model.ts` | `7623eae`, `86c2611` | Attribute only, but it changes which entity types the server resolves/validates for `ObjectId`. No JSON shape change. |
| `ConnectorObjectType` enum | `Group` | added | additive | **Yes** — `lib/models/entities/connector.model.ts:46-52` (core also has `EventCategory`, `BatchDefinition` — later additions) | `7623eae` | Appended after `Formula`. |
| `SignalValueResponse` (new type, `ExternalApi`) | `ObjectName: string`, `ObjectId: string`, `Value: string`, `Timestamp: DateTime`, `Quality: string` | new type | additive | **No** — closest is `lib/models/historical-value.model.ts` / `historical-value-operation.model.ts`, different shape | `f5a179c` | External API DTO; `Value` is a **string**, not typed — beware if mapped onto core's numeric historical-value types. |

Net-zero in this range: `Base/Path.cs` `PathList` change (`e88b30a`) was reverted by `bf44e7f` before `2ebe925`, so
`Path` wire shape is unchanged in 4.19. `5fc7dd9`/`edab289`/`5edd5f6` are Bson class-map/attribute only; `db0e233`
adds the JSON sub-class converter that makes `_t` discrimination work for the new backup hierarchy (wire-relevant
only in that without it the sub-types would not round-trip).

---

## Migrator cross-reference: `BatchDefinitionMigrator_V1.cs` (2024-11-04)

`/home/dev/src/audako/backend/structure/Migration/BatchDefinitionMigrator_V1.cs`, `[Migrator(typeof(BatchDefinition), 0)]`,
pairs with `[CollectionVersion(1)]` on `BatchDefinition` (`3547c00`, 4.17). It is a **stored-shape change**, not just
a code change: for every `BatchDefinition`, for each `MetadataFields[key]` whose `Source == MetadataSource.Manual`,
it sets

```
MetadataFields.{key}.Editable = (metadataField.ObligatoryAt == BatchAction.Stop)
```

i.e. it backfills the new `Editable` flag so that pre-existing manual metadata fields that were obligatory at batch
**Stop** become editable, preserving the old runtime behaviour. Non-manual fields are left without the property
(absent -> `false` on read). Consequences for a client:

- On a 4.17+ database, `MetadataField.Editable` is present for manual fields and may be absent for others -> treat
  absent as `false`.
- On a pre-4.17 database (or a 4.16 payload), `Editable` does not exist at all, and the "obligatory at Stop implies
  editable" rule is the implicit semantics the client must emulate.
- `BatchDefinition.Version` flips `0 -> 1`; do not treat `Version` as a client-owned optimistic-concurrency value
  across this boundary without re-reading.

---

## Summary for adapters

For a client whose canonical model is the **newest** shape (which audako-core already is for `DataConnection`,
`DataSource`, `EventDefinition`, `BatchDefinition.MetadataField` and `ConnectorObjectType`), the great majority of
4.16-4.19 changes are **additive-only** and need no adapter — just tolerate missing properties on older servers:
`AuditLog.NameTranslations`, `ApplicationSettings.Languages`/`TenantLanguage`, `TenantView.IncludesSelf`,
`DataConnection.SpecialDeviceProfile` / `PollingInterval`, `DataConnectionOpcUaSettings.TimestampSource`, the
`OneWire` enum value and `DataConnectionOneWireSettings`, `DataSource.PermaLiveModeSettings`, the `Group`
`ConnectorObjectType` value, and all the new 4.19 entities (`BackupDefinition`*, `ShortLinkDefinition`*,
`SynchronizationPartner.Allowed/BlockedEntities`, `SignalValueResponse`) which simply do not exist before 4.19.

Real adapters are needed for four things. (1) **`TranslatableField.Translations`** — pre-4.16 servers never emit it
and silently drop it on write, so `Name`/`Description` translations must be treated as unsupported below 4.16
rather than as "empty". (2) **`EventDefinition.EventCategoryId`** — below 4.17 it arrives as bare `null` instead of
`{Value:null}`, so any read path must coerce `null -> new Field(null)` before dereferencing `.Value`. (3)
**`BatchDefinition.MetadataField.Editable`** plus the `CollectionVersion(1)` migration — below 4.17 the property is
absent and its semantics must be derived from `ObligatoryAt == Stop`; also note the two-day window where the server
default was `true` before `d8897da` removed it. (4) **`PublicTenantView` -> `TenantView`** — the 4.16 collapse of the
two views is a superset for readers, but a client that keys off `PublicTenantView`-only fields should read
`IncludesSelf` defensively, since most `TenantView` construction sites leave it `false`. Two lesser divergences worth
encoding as client-side defaults rather than adapters: the server leaves `OpcUaSettings.TimestampSource`,
`DataConnection.PollingInterval` and `DataSource.PermaLiveModeSettings` uninitialized (`null`) where audako-core
eagerly defaults them, and `SynchronizationPartner`'s collections switch from `null` to `[]` in 4.19.

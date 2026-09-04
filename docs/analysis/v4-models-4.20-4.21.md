# audako v4 wire-visible model changes — 4.20 and 4.21

Source: `/home/dev/src/audako/backend/buildingblocks/structuremodels` (branch `master`, read-only).
Client under review: `/home/dev/src/github/audako-core/lib/models/`.

**Attribution caveat (stated once):** services reference `structuremodels` with wildcard versions, so a
release ships whatever was on `master` at its *first* build. Commits are attributed to the first release
whose first build post-dates them (4.19 first built 2025-06-04, 4.20 on 2025-09-08, 4.21 after 2025-10-30).
A hotfix rebuild of the *previous* release can therefore also pick up a change listed here — e.g. every
4.20 row below (dated 2025-06-12 … 2025-09-03) would also appear in any 4.19.x hotfix built after that
date. Treat the release column as "guaranteed from", not "exclusively in".

---

## 4.20 — `git diff 2ebe925..3a49e8c` (commits 2025-06-12 … 2025-09-03)

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `ConfigurationEntity` (all entity types) | `MaintenanceMode: bool` | added, non-`Field`, plain bool at entity root | additive | yes — `lib/models/entities/configuration-entity.model.ts:131` (`MaintenanceMode: boolean`, default `false`) | `a7bd5d1`, `17dfd9e` | Also added to `IConfigurationEntity`. Absent on <=4.19 responses → `undefined` on old platforms. |
| `TenantSettings` | `MaintenanceMode: bool` | added | additive | **no** — `lib/models/tenant-view.model.ts` only models `Id/Name/Description/Root/Enabled/Locked/Public/ApplicationSettings`; no tenant-settings model exists | `a7bd5d1` | Briefly refactored to `MaintenanceModeSettings: { Enabled: bool }` (`7f05b39`) and reverted the same day (`7b95b95`); the object shape was never in a released build. Final wire shape is the plain bool. |
| `Recipient` | `[CollectionVersion(1)]` | stored-shape version bump only | semantic (no JSON diff) | n/a (`lib/models/entities/recipient.model.ts` unchanged) | `59a423b` | Pairs with `RecipientMigrator_V1` (see migrator section) — `Salutation.Value` is rewritten in the DB, so the *value domain* of an existing JSON field changes. |
| `ReportTemplate` | `DefaultStepSize: Field<TimeStepSize>` | added, default `Day` | additive | yes — `lib/models/entities/report-template.model.ts` (`DefaultStepSize: Field<ReportTimeStepSize>`, default `Day`) | `7a19f7f` | New enum `TimeStepSize { Day, Week, Month, Year }`; core mirrors it as `ReportTimeStepSize` (name differs client-side only, values match). |
| `Connector` / `ConnectorObject` | `ConnectorObjectType` enum | value added: `EventCategory` | additive | yes — `lib/models/entities/connector.model.ts` (`ConnectorObjectType` has `Signal, Formula, Group, EventCategory, BatchDefinition`) | `9b8359a` → `fb5f647` | Landed transiently as `EnteredEvent` in `9b8359a` (same day, 2025-08-08) then replaced by `EventCategory` in `fb5f647`. Only `EventCategory` was ever released. Core additionally lists `BatchDefinition`, which is *not* in the C# enum at `3a49e8c`/`4ec211d` — client-only extra value. |
| `EnteredEvent` (new type) | whole class + `EventTrigger` hierarchy | new wire type with `_t` discriminator (`EventTrigger` abstract, `ConditionEventTrigger`), plus `EventReciept` and `EventReceiptTypes { User, Recipient, System }` | structural / additive | **no** entity model — only `lib/models/widgets/widget-entered-event-config.ts` (a widget config, unrelated shape) | `9b8359a` | Runtime/event document (not a `ConfigurationEntity`): `Id, EventId, Name(+NameTranslations), Description(+DescriptionTranslations), EventCategoryId, IncomingOn, OutgoingOn, ReceiptedOn, ReceiptedBy, IsTestEvent, Trigger, Note, GroupId, Window[]`. `Trigger` uses `_t` (Bson-ignored, JSON-emitted read-only). |
| `DataConnection` | `DataConnectionType` enum value `MeterBus` | added | additive | yes — `lib/models/entities/data-connection.model.ts:25` | `19bbcc2` | |
| `DataConnectionMeterBusSettings` (new sub-type) | `Mode: Field<MeterBusMode>`, `HostOrSerialPort: Field<string>`, `Port: Field<ushort>`, `BaudRate: Field<uint>`, `Timeout: Field<uint>` | new discriminated sub-type of `DataConnectionTypedSettings` | additive / structural | yes — `lib/models/entities/data-connection.model.ts:323` | `19bbcc2` | New enum `MeterBusMode { serial, tcp }` (lowercase names → lowercase JSON strings). C# has **no constructor defaults** (all fields null); core defaults to `tcp/null/0/2400/5000`. Server-created objects will come back with null fields. |
| `MessageLineSettings` (base) | `_t` | `string` get/set → computed read-only `virtual string _t => GetType().Name`, `[BsonIgnore]` | semantic | not modeled (no message-settings model in `lib/models/`) | `9c36e4e`, `a8cfcde`, `f2dacf8` | JSON still emits `_t`, but it is now **derived from the runtime type and ignored on deserialization** — a client can no longer choose the sub-type by sending `_t`; the sub-type must be resolvable by `JsonSubClassConverter`. Also `[CollectionVersion(2)]`. |
| `EmailMessageSettings` | flat SMTP fields → `SpecificSettings: SpecificEmailMessageSettings` | **structural**: `SendingName, SendingEmail, Password, User, ServerHost, ServerPort, UseSSL, UseStartTLS` moved off `EmailMessageSettings` into a nested discriminated object | structural | not modeled | `762c2a3`, `7ab331a`, `edb3d2c` | Breaking for anything reading the flat fields. Backed by `MessageLineSettingsMigrator_V2`. |
| `SpecificEmailMessageSettings` (new abstract) | `_t` discriminator | new sub-type hierarchy | structural | not modeled | `762c2a3` | Sub-types below. |
| `SMTPEmailMessageSettings` (new sub-type) | `SendingName, SendingEmail, Password, User, ServerHost, ServerPort, UseSSL, UseStartTLS` | new sub-type carrying the ex-flat fields | structural | not modeled | `762c2a3` | `_t = "SMTPEmailMessageSettings"`. |
| `GraphEmailMessageSettings` (new sub-type) | `ClientId, TenantId, ClientSecret, UserId` | new sub-type (MS Graph mail sending) | additive / structural | not modeled | `762c2a3` | `_t = "GraphEmailMessageSettings"`. |
| `SMSMessageSettings` | `Modem: string` | added | additive | not modeled | `27c4cb1` | |
| `SMSMessageSettings` | `AcknowledgmentKeyword: string` | added | additive | not modeled | `8187a84` | |
| `EmailMessageSettings` / `SpecificEmailMessageSettings` | `Obfuscate()` / `Clone()` | helper methods only — **not yet wired into any controller in 4.20** | (no wire change in 4.20) | n/a | `e261545` | The API-visible effect arrives in 4.21 (see below). |

Ignored in this range: `Jenkinsfile`, Bson attribute-only edits, `using` cleanups.

---

## 4.21 — `git diff 3a49e8c..4ec211d` (commits 2025-09-09 … 2025-10-30)

| Entity | Property/Type | Change | Class | In audako-core? (file) | Commit | Note |
|---|---|---|---|---|---|---|
| `BatchDefinition` | `BatchReviewSettings: BatchReviewSettings` | added | additive | yes — `lib/models/entities/batch-definition.model.ts` (`BatchReviewSettings`) | `4788309` → `1516e3d` | **The "rename+revert" is a misreading of the log.** `4788309` introduced it as `ReviewSettings`; `1516e3d` renamed it to `BatchReviewSettings` and that rename **was never reverted**. The two look-alike commits `fca4523` ("renamed ReviewSettings field") and `1f6acbb` ("Revert …") have mislabeled messages and actually touch `Base/Tenant/Tenant.cs` — they add and then remove an unreferenced `MigrationApiSettings { Enabled, ApiKey }` class (net zero, no property ever pointed at it). Final wire name: **`BatchReviewSettings`**. Since both name variants are inside the same release window, no released build ever exposed `ReviewSettings` (unless a 4.20 hotfix was built between 2025-09-09 and the rename the same day). |
| `BatchReviewSettings` (new type) | `Enabled: bool`, `Reviews: BatchReviewDefinition[]`, `Ordered: bool` | new nested type | additive / structural | yes — `lib/models/entities/batch-definition.model.ts` (`Enabled=false, Reviews=[], Ordered=false`) | `4788309`, `7e866c0` | `Enabled` was added one commit later (`7e866c0`, same day). Defaults set in the `BatchDefinition` ctor: `Enabled=false, Reviews=[], Ordered=false` — matches core. |
| `BatchReviewDefinition` (new type) | `Name: TranslatableField<string>`, `Instructions: TranslatableField<string>`, `Reviewers: string[]` | new nested type | additive | yes — `lib/models/entities/batch-definition.model.ts` | `4788309` | `Name`/`Instructions` are wrapped (`{Value, OOAttributes, Translations}`), not plain strings. |
| `EventCategory` | `NoRepeatUntilAcknowledged: Field<bool>` | added | additive | yes — `lib/models/entities/event-category.model.ts` | `c03bc83` | No ctor default at `4ec211d` → serialized as `null` unless set. Core defaults it to `false`. |
| `EventCategory` | `AlarmOn: Field<AlarmTrigger>` | added, default `OnRaised` | additive | yes — `lib/models/entities/event-category.model.ts` (`AlarmOn: Field<AlarmTrigger>`, default `OnRaised`) | `c03bc83` → `a40e5f1` → `b898067` → `42bce81` | **Final shape = `[Flags] enum AlarmTrigger { OnRaised = 1, OnDropped = 2 }` inside a single `Field<AlarmTrigger>`, i.e. `{ "AlarmOn": { "Value": 1 } }` / `"OnRaised, OnDropped"` for combined values — NOT an array.** The Sept-2025 churn: `c03bc83` flags → `a40e5f1` `Field<IEnumerable<AlarmTrigger>>` (array, default `["OnRaised"]`) → `b898067` dropped `[Flags]` and the explicit 1/2 values (so `OnRaised=0, OnDropped=1`) → `42bce81` reverted the whole thing back to `[Flags]` scalar with 1/2. All four commits are 2025-09-28, one day apart from each other in the same release window, so **only the final flags form was ever released**. Core matches (numeric enum `OnRaised = 1, OnDropped = 2`). |
| `MessageLineSettings` (base) | `Obfuscate()`, `UpdateOrKeepObfuscatedSettings(old)` | new abstract members, implemented on every sub-type | **semantic — yes, it changes what the API returns** | not modeled | `eddcd69`, `9406ba5`, `ef05e29` (+ structure `8f8c86e`, 2025-10-16) | See "Obfuscation" section. |
| `SMSMessageSettings` | `SMSPassword` value | now returned as `"***"` by the API | semantic | not modeled | `eddcd69` | |
| `VoipMessageSettings` | `Password` value | now returned as `"***"` | semantic | not modeled | `eddcd69` | |
| `TeamsMessageSettings` | `ApiKey` value | now returned as `"***"` | semantic | not modeled | `eddcd69` | |
| `TelegramMessageSettings` | `BotID` value | now returned as `"***"` | semantic | not modeled | `eddcd69` | `BotID` is *both* the secret and the identifier — obfuscating it means the plaintext bot id is no longer readable via the API. |
| `PushoverMessageSettings` | `PushoverToken` value | now returned as `"***"` | semantic | not modeled | `eddcd69` | |
| `SMTPEmailMessageSettings` | `Password` value | now returned as `"***"` | semantic | not modeled | `eddcd69` | |
| `GraphEmailMessageSettings` | `ClientSecret` value | now returned as `"***"` | semantic | not modeled | `eddcd69` | |
| `SignalValueResponse` (ExternalApi) | `ObjectAlias: string` | added | additive | **no** — no external-api response models in `lib/models/` | `1c39fc6` | |
| `GroupOverviewResponse` (new type) | `GroupName, GroupId, Objects: GroupOverviewObject[]` | new response type | additive | **no** | `4ec211d` | |
| `GroupOverviewObject` (new type) | `ObjectName, ObjectAlias, ObjectId` | new response type | additive | **no** | `4ec211d` | |
| `Timezones` | `AvailableTimezones` dictionary | values added: `WITA` (Central Indonesian, `Asia/Makassar`), `WIT` (Eastern Indonesian, `Asia/Jayapura`) | additive | **no** — core has no timezone catalogue; `Signal.Timezones: Field<string[]>` just stores the keys (`lib/models/entities/signal.model.ts:194`) | `5a9ee20` | Enlarges the accepted/returned key domain for any timezone string field. |
| `SwitchOperation` | `SwitchScheduleId` | `[Relation(typeof(SwitchSchedule))]` added | semantic (metadata, no JSON shape change) | property exists — `lib/models/entities/switch-schedule.model.ts:30` | `4c28017` | Field name/type unchanged; the attribute only affects server-side relation resolution (export/clone/instancing). No client adapter needed. |

Ignored in this range: whitespace-only edits in `Timezones.cs`, a stray `using MongoDB.Driver.Core.Clusters;`.

---

## MessageSettings obfuscation — does it change what the API returns?

**Yes.** The model-side `Obfuscate()` (4.21, `eddcd69`) is actually called by the structure service:
`/home/dev/src/audako/backend/structure/Features/MessageConfiguration/MessageConfigurationController.cs`
(commit `8f8c86e`, 2025-10-16 — same release window):

- line 50 — `GET` single message line → `Ok(messageLine.Obfuscate())`
- lines 69, 77, 105 — list endpoints (incl. inherited parent-tenant lines) → `.Select(mls => mls.Obfuscate())`
- lines 190/194 — `PUT`/update → `messageLineSettings.UpdateOrKeepObfuscatedSettings(old)` before persisting, response also obfuscated

Wire consequences:

1. Secret-bearing string properties come back as the literal `"***"` instead of their value. The property is
   still present and still a string, so the *shape* is unchanged — the *semantics* are not. Nothing that
   round-trips a message line can assume the read value is real.
2. `"***"` is a **sentinel on write**: `UpdateOrKeepObfuscatedSettings` substitutes the stored value whenever
   the incoming field equals `"***"`. So a naive read-modify-write is now *safe* (secret preserved) on >=4.21,
   but on <=4.20 the same round-trip would have written the literal `"***"` into the DB — and conversely, a
   client that deliberately wants to set a secret to the string `"***"` can no longer do so.
3. `ef05e29` made `UpdateOrKeepObfuscatedSettings` immutable (operates on a `Clone()` rather than mutating
   `this`); behavioural fix only, no wire difference.
4. Email is two-level: `EmailMessageSettings.Obfuscate()` delegates into `SpecificSettings.Obfuscate()`, and
   if the client omits `SpecificSettings` entirely on update, the old `SpecificSettings` is retained wholesale.

audako-core does not model message-line settings at all (`lib/models/` has no `MessageLineSettings`/
`EmailMessageSettings`), so this is currently a non-issue for the client — but it is the trap to document if
message-line support is ever added.

---

## Structure-service migrators (stored-shape changes)

Located in `/home/dev/src/audako/backend/structure/Migration/`.

| Migrator | Commit / date | Targets | What it rewrites | Release |
|---|---|---|---|---|
| `RecipientMigrator_V1.cs` | `181c960` / `3b024bd` 2025-06-12, typo fix `7c19825` 2025-06-13 | `[Migrator(typeof(Recipient), 0)]` — runs on collection version 0 → 1 | Strips the GUID suffix from `Recipient.Salutation.Value`: `"MALESALUTATION#29fa1bf9-…"` → `"MALESALUTATION"`, `"FEMALESALUTATION#3d1e87bb-…"` → `"FEMALESALUTATION"`. Same JSON field, same type (`Field<string>`); the **value domain** changes. Skips null field / null `.Value`. | Model-side `[CollectionVersion(1)]` (`59a423b`, 2025-06-12) is in the 4.20 diff, and the migrator commits post-date 4.19's first build (2025-06-04) → **lands in 4.20** (may also be present in a 4.19 hotfix). |
| `MessageLineSettingsMigrator_V1.cs` | `001e040` 2025-07-03 (file added alongside V2) | `[Migrator(typeof(MessageLineSettings), 0)]` — collection version 0 → 1 | Repairs the `_t` discriminator: first `Unset("_t")` on every document (it had been stored as a duplicate key because the old model had a settable `_t` property), then re-derives `_t` from a distinguishing field — `PushoverToken`→`PushoverMessageSettings`, `SendingEmail`→`EmailMessageSettings`, `SMSUser`→`SMSMessageSettings`, `BotEndpoint`→`TeamsMessageSettings`, `BotID`→`TelegramMessageSettings`, `VoipID`→`VoipMessageSettings`. Corresponds to the model change making `_t` computed + `[BsonIgnore]` (`a8cfcde`) and `[CollectionVersion(2)]`. | **4.20** (2025-07-03 is after 4.19's 2025-06-04 build, before 4.20's 2025-09-08). |
| `MessageLineSettingsMigrator_V2.cs` | `001e040` 2025-07-03, bugfix `c26d410` 2025-08-05 | `[Migrator(typeof(MessageLineSettings), 1)]` — collection version 1 → 2 | For `_t == "EmailMessageSettings"`, moves the eight flat SMTP fields (`SendingName, SendingEmail, Password, User, ServerHost, ServerPort, UseSSL, UseStartTLS`) into a nested `SpecificSettings` document with `_t = "SMTPEmailMessageSettings"`, and `Unset`s the originals. `c26d410` fixed a crash on legacy documents lacking `UseStartTLS` (now defaults to `false`). This is the stored-side counterpart of the 4.20 `SpecificSettings` restructuring. | **4.20**. |

---

## Summary for adapters

For a client whose canonical model is the **newest** shape (which audako-core's `lib/models/` already is —
it carries `MaintenanceMode`, `DefaultStepSize`, `MeterBus`, flags-style `AlarmOn`, `NoRepeatUntilAcknowledged`
and `BatchReviewSettings` today), almost everything in 4.20/4.21 is **additive-only**: the older platform
simply omits the field, so reads degrade to `undefined`/`null` and writes carry a property 4.12–4.19 ignores.
That covers `ConfigurationEntity.MaintenanceMode`, `ReportTemplate.DefaultStepSize` + `TimeStepSize`,
`DataConnectionType.MeterBus` + `DataConnectionMeterBusSettings` + `MeterBusMode`,
`ConnectorObjectType.EventCategory`, `EventCategory.AlarmOn`/`NoRepeatUntilAcknowledged`,
`BatchDefinition.BatchReviewSettings` (+ `BatchReviewSettings`/`BatchReviewDefinition`),
`SMSMessageSettings.Modem`/`AcknowledgmentKeyword`, the two Indonesian timezone keys, `EnteredEvent`, and the
ExternalApi `ObjectAlias`/`GroupOverview*` types — none of which need an adapter. Two additive items need a
defaulting note rather than an adapter: server-side `MeterBus` settings and `NoRepeatUntilAcknowledged` have
**no C# constructor defaults**, so a 4.20/4.21 server returns `null` where core's constructor would have put
`tcp`/`2400`/`5000`/`false` — don't treat "field present but null" as a real value.

Genuine adapters are needed for three things, none of which audako-core currently models, so today the
practical adapter surface for this client is **zero**:
(1) **`EmailMessageSettings` flat → `SpecificSettings`** (4.20, `762c2a3` + `MessageLineSettingsMigrator_V2`) —
the only true structural break in these two releases; a pre-4.20 server exposes `SendingEmail`/`Password`/… on
the message line itself, a >=4.20 server nests them under `SpecificSettings` with `_t: "SMTPEmailMessageSettings"`,
and `GraphEmailMessageSettings` is a second variant that has no pre-4.20 representation at all.
(2) **`MessageLineSettings._t` becoming computed and Bson/deserialization-ignored** (4.20) — a client can no
longer pick a sub-type by sending `_t`; write paths must be sub-type aware.
(3) **Message-line secret obfuscation** (4.21) — `"***"` is returned in place of every secret and is a
"keep existing" sentinel on write; a client that must work across 4.12–4.23 has to branch, because the same
round-trip that preserves the secret on >=4.21 destroys it on <=4.20.

Two churn sequences resolve to no adapter work at all: `EventCategory.AlarmOn` ended where it started, as a
scalar `[Flags]` `Field<AlarmTrigger>` with `OnRaised = 1, OnDropped = 2` (the `IEnumerable` form existed for
one day within a single release window and never shipped), and `BatchDefinition`'s field is finally
`BatchReviewSettings` — the commits that look like a revert of that rename actually touch `Tenant.cs` and
cancel out an unused `MigrationApiSettings` class. Likewise `Tenant.MaintenanceMode` is a plain bool; its
one-day `MaintenanceModeSettings { Enabled }` object form never reached a build.

# Adapter fixtures

**These payloads are synthesized, not captured.** They were hand-written from the model
definitions in `lib/models/entities/*.model.ts` and the release-by-release wire diffs in
`docs/analysis/v4-models-*.md` / `docs/analysis/v4-to-v5-models.md`. Ids, names and timestamps are
made up.

Capturing real payloads from a 4.12, a 4.23 and a 5.0 system is open item 4 of
`docs/v4-v5-compatibility-plan.md`. When that happens, replace these files rather than adding
next to them, and drop this warning for the files that are real.

## Layout

| File | Represents |
|---|---|
| `v4/<entity>.4.12.json` | oldest supported v4 platform: pre-migrator values, none of the fields added in 4.13+, `TranslatableField` without `Translations`, no `Tags`/`Alias`, absent keys instead of nulls |
| `v4/<entity>.4.23.json` | final v4 platform: everything the v4 window ever added, post-rename names |
| `v5/<entity>.5.0.json` | v5: same as 4.23 plus `Path`, every property present (null instead of absent), plus the v5-only additions (`EventCategory.Acknowledgment`) |

Extra, non-release fixture:

| File | Represents |
|---|---|
| `v4/dashboard-tab.4.15-legacy-id.json` | a tab document written in the few weeks *inside* the 4.15 range when `DashboardTabEntity` still used `Id` instead of `EntityId`, and the short-lived `EntityMapping` (singular, `string -> string`) field existed next to `EntityMappings`. Both spellings survive in stored documents on any later 4.x, which is why the `DashboardTab` adapter reads both on every v4 version. |

## Conventions

- `Field<T>` is always `{ "Value": ..., "OOAttributes": [] }`; `TranslatableField<T>` adds
  `"Translations": {}` from 4.16 on and omits the key before that.
- `AlarmOn` is a `[Flags]` enum and serializes as a number (`1` = `OnRaised`).
- Absent vs. `null` is meaningful: the 4.12 files omit keys the platform did not have yet, the v5
  files spell out `null`, because v5 serializes every CLR property.

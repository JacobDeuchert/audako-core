import { EventCategory } from '../../../models/entities/event-category.model.js';
import { EntityAdapter } from '../entity-adapter.js';
/**
 * v4 adapter for `EventCategory`.
 *
 * Two rules meet on the same wire key, so they are stated together:
 * - Plan, "v4 window": 4.23 renamed `Acknowledgment` to `RequiresAcknowledgment` with **no**
 *   server migrator. On 4.12 - 4.22 the wire key `Acknowledgment` therefore *is*
 *   `RequiresAcknowledgment`; read either spelling and write the legacy name below 4.23.
 * - Plan, "4.23 -> 5.0": v5 re-adds `Acknowledgment: Field<bool>` next to
 *   `RequiresAcknowledgment` with a different meaning. That field only exists on v5, so on v4 it
 *   is never read into the canonical model and never written - otherwise its value would silently
 *   become `RequiresAcknowledgment` on an older platform.
 *
 * Consequence: `Acknowledgment` is the legacy alias on v4 and a distinct field on v5. The adapter
 * only ever touches it on v4; v5 is identity.
 */
export declare const eventCategoryAdapterV4: EntityAdapter<EventCategory>;

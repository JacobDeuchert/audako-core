import { EntityType } from '../../models/entities/configuration-entity.model.js';
import type { EndpointTable } from './endpoint-resolver.js';
/**
 * v4 domain-prefixed entity paths, appended to the structure service root
 * (`{structure}/base/Group`). Mirrors `V5_ENTITY_SEGMENTS`; `Record<EntityType, string>` makes a
 * missing entity type a compile error. `Storage` is intentionally absent: it is no longer a
 * configuration entity in v5 and was dropped from audako-core.
 *
 * The `/alarming/`, `/maintenance/` and `/runtime/` prefixes reproduce exactly what core sent
 * before 2.0; see open item 2 in docs/migration-2.0.md.
 */
export declare const V4_ENTITY_PATHS: Record<EntityType, string>;
/** v4 endpoint table (platform 4.12 - 4.23). See docs/analysis/v4-to-v5-endpoints.md. */
export declare const V4_ENDPOINTS: EndpointTable;

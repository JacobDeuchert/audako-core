import { EntityType } from '../../models/entities/configuration-entity.model.js';
import type { EndpointTable } from './endpoint-resolver.js';
/**
 * v4 domain-prefixed entity paths (`/base/Group`) became kebab-plural segments under the
 * structure service root. Table taken from the "Entity segment map" in
 * docs/analysis/v4-to-v5-endpoints.md. `Storage` is intentionally absent: it is no longer a
 * configuration entity in v5 and was dropped from audako-core.
 */
export declare const V5_ENTITY_SEGMENTS: Record<EntityType, string>;
/** HTTP method used for entity queries on v5. */
export declare const QUERY_METHOD = "QUERY";
/** v5 endpoint table (platform 5.x). See docs/analysis/v4-to-v5-endpoints.md. */
export declare const V5_ENDPOINTS: EndpointTable;


import { Type } from '../interfaces/type';
import { BatchDefinition } from './entities/batch-definition.model.js';
import { ConfigurationEntity, EntityType } from './entities/configuration-entity.model.js';
import { DashboardTab } from './entities/dashboard-tab.model.js';
import { Dashboard } from './entities/dashboard.model.js';
import { DataConnection } from './entities/data-connection.model.js';
import { DataSource } from './entities/data-source.model.js';
import { EventCategory } from './entities/event-category.model.js';
import { EventCondition } from './entities/event-condition.model.js';
import { EventDefinition } from './entities/event-definition.model.js';
import { Formula } from './entities/formula.model.js';
import { Group } from './entities/group.model.js';
import { ProcessImage } from './entities/process-image.model.js';
import { Signal } from './entities/signal.model.js';

export const EntityTypeClassMapping: {[p in EntityType]: Type<ConfigurationEntity> } = {
  [EntityType.Group]: Group,
  [EntityType.Signal]: Signal,
  [EntityType.Dashboard]: Dashboard,
  [EntityType.DashboardTab]: DashboardTab,
  [EntityType.DataConnection]: DataConnection,
  [EntityType.DataSource]: DataSource,
  [EntityType.EventCategory]: EventCategory,
  [EntityType.EventCondition]: EventCondition,
  [EntityType.EventDefinition]: EventDefinition,
  [EntityType.Formula]: Formula,
  [EntityType.ProcessImage]: ProcessImage,
  [EntityType.BatchDefinition]: BatchDefinition
}

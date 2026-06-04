import { Type } from '../interfaces/type.js';
import { AlarmingPlan } from './entities/alarming-plan.model.js';
import { BatchDefinition } from './entities/batch-definition.model.js';
import { Camera } from './entities/camera.model.js';
import { ConfigurationEntity, EntityType } from './entities/configuration-entity.model.js';
import { Connector } from './entities/connector.model.js';
import { DashboardTab } from './entities/dashboard-tab.model.js';
import { Dashboard } from './entities/dashboard.model.js';
import { DataConnection } from './entities/data-connection.model.js';
import { DataSource } from './entities/data-source.model.js';
import { Document } from './entities/document.model.js';
import { EventCategory } from './entities/event-category.model.js';
import { EventCondition } from './entities/event-condition.model.js';
import { EventDefinition } from './entities/event-definition.model.js';
import { Formula } from './entities/formula.model.js';
import { Group } from './entities/group.model.js';
import { MaintenanceService } from './entities/maintenance-service.model.js';
import { ProcessImage } from './entities/process-image.model.js';
import { Recipient } from './entities/recipient.model.js';
import { RecipientGroup } from './entities/recipient-group.model.js';
import { Report } from './entities/report.model.js';
import { ReportTemplate } from './entities/report-template.model.js';
import { Role } from './entities/role.model.js';
import { RuntimeScript } from './entities/runtime-script.model.js';
import { Signal } from './entities/signal.model.js';
import { Storage } from './entities/storage.model.js';
import { SwitchSchedule } from './entities/switch-schedule.model.js';
import { TaskDefinition } from './entities/task-definition.model.js';
import { User } from './entities/user.model.js';

export const EntityTypeClassMapping: Partial<Record<EntityType, Type<ConfigurationEntity>>> = {
  [EntityType.Group]: Group,
  [EntityType.Signal]: Signal,
  [EntityType.Dashboard]: Dashboard,
  [EntityType.DashboardTab]: DashboardTab,
  [EntityType.DataConnection]: DataConnection,
  [EntityType.DataSource]: DataSource,
  [EntityType.Connector]: Connector,
  [EntityType.EventCategory]: EventCategory,
  [EntityType.EventCondition]: EventCondition,
  [EntityType.EventDefinition]: EventDefinition,
  [EntityType.Formula]: Formula,
  [EntityType.ProcessImage]: ProcessImage,
  [EntityType.BatchDefinition]: BatchDefinition,
  [EntityType.ReportTemplate]: ReportTemplate,
  [EntityType.Report]: Report,
  [EntityType.Document]: Document,
  [EntityType.Storage]: Storage,
  [EntityType.Camera]: Camera,
  [EntityType.SwitchSchedule]: SwitchSchedule,
  [EntityType.User]: User,
  [EntityType.Role]: Role,
  [EntityType.Recipient]: Recipient,
  [EntityType.RecipientGroup]: RecipientGroup,
  [EntityType.AlarmingPlan]: AlarmingPlan,
  [EntityType.MaintenanceService]: MaintenanceService,
  [EntityType.TaskDefinition]: TaskDefinition,
  [EntityType.RuntimeScript]: RuntimeScript,
};

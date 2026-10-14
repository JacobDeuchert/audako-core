import { TranslatableField } from './entities/configuration-entity.model.js';

export type ProcessImageBlockParameterType = 'Entity' | 'Color' | 'Text' | 'Number';

export interface ProcessImageBlockParameter {
  Key: string;
  Type: ProcessImageBlockParameterType;
  EntityTypes: string[];
  Default: string;
  Label: string;
}

/** A reusable, parameterized SVG fragment owned by a tenant. v5 only. */
export interface ProcessImageBlock {
  Id: string;
  TenantId: string;
  Key: string;
  Name: TranslatableField<string>;
  Description: TranslatableField<string>;
  Revision: number;
  Parameters: ProcessImageBlockParameter[];
  Width: number;
  Height: number;
  UsageCount: number;
  CreatedBy: string;
  CreatedOn: string;
  ChangedBy: string | null;
  ChangedOn: string | null;
}

/** A process image that places instances of a block. */
export interface ProcessImageBlockUsage {
  ProcessImageId: string;
  Name: TranslatableField<string>;
  GroupId: string | null;
  Revision: number;
  InstanceCount: number;
}

export type BlockInstanceWarningCode =
  | 'BlockUnavailable'
  | 'BlockRebound'
  | 'TransformNormalized'
  | 'ParameterValueIgnored';

export interface BlockInstanceWarning {
  InstanceId: string;
  BlockKey: string;
  BlockId: string | null;
  Code: BlockInstanceWarningCode;
  Parameter: string | null;
}

export interface ProcessImageBlockMaterialization {
  /** The instance's children, serialized; ids are prefixed with the instance id. */
  Content: string;
  Revision: number;
  Warnings: BlockInstanceWarning[];
}

export interface ProcessImageBlockPreview {
  BlockId: string;
  Revision: number;
  /** A standalone SVG of the block with its parameter defaults applied. */
  Content: string;
}

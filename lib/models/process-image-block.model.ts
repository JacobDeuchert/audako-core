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
  /** The current revision is used by an image; the next upload creates a new revision instead of overwriting it. */
  Sealed: boolean;
  Parameters: ProcessImageBlockParameter[];
  Width: number;
  Height: number;
  UsageCount: number;
  CreatedBy: string;
  CreatedOn: string;
  ChangedBy: string | null;
  ChangedOn: string | null;
}

/** One revision of a block with the parameters and size it was uploaded with. */
export interface ProcessImageBlockRevision {
  Revision: number;
  Parameters: ProcessImageBlockParameter[];
  Width: number;
  Height: number;
}

/** A process image that places instances of a block, with the revisions its instances are on. */
export interface ProcessImageBlockUsage {
  ProcessImageId: string;
  Name: TranslatableField<string>;
  GroupId: string | null;
  Revisions: ProcessImageBlockRevisionUsage[];
}

export interface ProcessImageBlockRevisionUsage {
  Revision: number;
  InstanceCount: number;
}

export type BlockInstanceWarningCode =
  | 'BlockUnavailable'
  | 'BlockRebound'
  | 'RevisionUnavailable'
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

/** Without `Revision` the current one is previewed. */
export interface ProcessImageBlockPreviewRequest {
  BlockId: string;
  Revision?: number;
}

export interface ProcessImageBlockPreview {
  BlockId: string;
  Revision: number;
  /** A standalone SVG of the block with its parameter defaults applied. */
  Content: string;
}

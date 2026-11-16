import { TranslatableText } from './translatable-text.model.js';

export class TenantView {
  public Id: string;
  /** Translatable since v5; `TenantHttpService` wraps the plain v4 string. */
  public Name: TranslatableText;
  /** Translatable since v5; `TenantHttpService` wraps the plain v4 string. */
  public Description: TranslatableText;
  public Root: string;
  public Enabled: boolean;
  public Locked: boolean;
  public Public: boolean;
  public ApplicationSettings: { [p: string]: any };
  public IncludesSelf?: boolean;
  public Position?: number;

  constructor(options?: Partial<TenantView>) {
    this.Name = new TranslatableText();
    this.Description = new TranslatableText();
    Object.assign(this, options);
  }
}

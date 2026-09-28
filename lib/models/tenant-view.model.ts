export class TenantView {
  public Id: string;
  public Name: string;
  public Description: string;
  public Root: string;
  public Enabled: boolean;
  public Locked: boolean;
  public Public: boolean;
  public ApplicationSettings: { [p: string]: any };
  /** Sort position among the tenant's siblings. Sent from 4.16 on, undefined before. */
  public Position?: number;

  constructor(options?: Partial<TenantView>) {
    Object.assign(this, options);
  }
}

export class TenantView {
  public Id: string;
  public Name: string;
  public Description: string;
  public Root: string;
  public Enabled: boolean;
  public Locked: boolean;
  public Public: boolean;
  public ApplicationSettings: { [p: string]: any };

  constructor(options?: Partial<TenantView>) {
    Object.assign(this, options);
  }
}

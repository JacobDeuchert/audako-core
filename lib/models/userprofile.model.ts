export class UserProfile {
  public UserId: string;
  public UserName: string;
  public AccessId: string;
  public CreatedOn: Date;
  public EMail: string;
  public FirstName: string;
  public LastName: string;
  public PersonalDashboard: string;
  public UserSettings: Record<string, string>;
}

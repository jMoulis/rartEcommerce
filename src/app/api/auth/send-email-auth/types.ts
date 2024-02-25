export interface IEmailVerif { email: string, companyName: string; contactName: string, mailSystem: string, subject: string, userId: string }
export interface IEmailWithLinkToken extends IEmailVerif {
  linkToken: string
}

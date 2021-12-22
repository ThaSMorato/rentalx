export interface IMailProvider {
  sendMail(
    to: string,
    subject: string,
    variables: { [key: string]: string | number },
    path: string
  ): Promise<void>;
}

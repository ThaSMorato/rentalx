import { container } from "tsyringe";

import { IMailProvider } from "./IMailProvider";
import { EtherealMailProvider } from "./implementations/EtherealMailProvider";
import { SESMailProvider } from "./implementations/SESMailProvider";

const mail = {
  ETHEREAL: container.resolve(EtherealMailProvider),
  SES: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  "MailProvider",
  mail[process.env.MAIL_PROVIDER]
);

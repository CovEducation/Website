import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import mandrill from "nodemailer-mandrill-transport";
import twilio from "twilio";
import dotenv from "dotenv";
import findUp from "find-up";
import {
  CommunicationTemplates,
  generateTemplate,
  dataGenerators,
  templateSubjects,
} from "./Templates";
import CommunicationPreference from "../../models/CommunicationPreference";
import { IMentor } from "../../models/Mentors";
import { IParent } from "../../models/Parents";
import { IStudent } from "../../models/Students";

dotenv.config({ path: findUp.sync(".env") });

export interface MessageData {
  mentor?: IMentor;
  parent?: IParent;
  student?: IStudent;
  message?: string;
}

class CommunicationService {
  private transporter: Mail;
  private smsClient: twilio.Twilio;
  constructor() {
    this.connect();
  }

  private connect() {
    CommunicationService.verifyEnvironment();

    const mandrillKey = process.env.MANDRILL_APIKEY;
    this.transporter = nodemailer.createTransport(
      mandrill({ auth: { apiKey: mandrillKey } })
    );
    const twilioSID = process.env.TWILIO_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    this.smsClient = twilio(twilioSID, twilioToken);
  }

  private static verifyEnvironment() {
    // TODO(johanc): This method of loading env variables is messy. Create a config file that loads the environment that is shared among all components.
    const requiredEnvKeys = [
      "MANDRILL_APIKEY",
      "TWILIO_SID",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_NUM",
    ];
    requiredEnvKeys.forEach((key) => {
      if (process.env[key] === undefined) {
        throw new Error(`CommunicationService: Missing env key ${key}`);
      }
    });
  }

  public sendMessage(
    user: IMentor | IParent,
    template: CommunicationTemplates,
    info: MessageData
  ): Promise<void> {
    const recipient = this.getRecipientAddress(user);
    if (recipient === undefined || recipient.length === 0) {
      return Promise.reject("Invalid email");
    }
    return CommunicationService.verifyMessage(
      recipient,
      user.communicationPreference
    ).then(() => {
      if (user.communicationPreference === CommunicationPreference.EMAIL) {
        return this.sendEmail(recipient, template, info);
      } else if (user.communicationPreference === CommunicationPreference.SMS) {
        return this.sendSMS(recipient, template, info);
      } else {
        throw Error(
          `CommunicationService::sendMessage(): Invalid communication method: ${user.communicationPreference}`
        );
      }
    });
  }

  private getRecipientAddress(user: IMentor | IParent) {
    if (user.communicationPreference === CommunicationPreference.SMS) {
      return user.phone;
    } else if (user.communicationPreference === CommunicationPreference.EMAIL) {
      return user.email;
    } else {
      throw new Error(
        `Invalid communication method: ${user.communicationPreference}`
      );
    }
  }

  // Promise so sendMessage remains a promise.
  private static verifyMessage(
    recipient: string,
    method: CommunicationPreference
  ): Promise<void> {
    if (
      method === CommunicationPreference.EMAIL &&
      !CommunicationService.isEmail(recipient)
    ) {
      return Promise.reject(
        `CommunicationService::verifyMessage(): Invalid email ${recipient}`
      );
    } else if (
      method === CommunicationPreference.SMS &&
      !CommunicationService.isPhone(recipient)
    ) {
      return Promise.reject(
        `CommunicationService::verifyMessage(): Invalid phone ${recipient}`
      );
    }
    return Promise.resolve();
  }

  private static isEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private static isPhone(phone: string) {
    return /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(
      phone
    );
  }

  private async sendEmail(
    recipient: string,
    template: CommunicationTemplates,
    info: MessageData
  ) {
    if (
      dataGenerators[template] === undefined ||
      templateSubjects[template] === undefined
    ) {
      throw new Error("Unsupported template.");
    }
    const data = dataGenerators[template](info);
    const html = this.generateEmail(template, data);
    const mailOptions = {
      from: "CovEd <coved@coved.org>",
      to: recipient,
      subject: templateSubjects[template],
      html: html,
    };
    await this.transporter.sendMail(mailOptions);
  }

  private generateEmail(template: CommunicationTemplates, data: any) {
    const generator = generateTemplate(template, CommunicationPreference.EMAIL);
    return generator(data);
  }

  private async sendSMS(
    recipient: string,
    template: CommunicationTemplates,
    info: MessageData
  ) {
    const data = dataGenerators[template](info);
    const text = generateTemplate(template, CommunicationPreference.SMS)(data);
    await this.smsClient.messages.create({
      body: text,
      from: process.env.TWILIO_NUM,
      to: recipient,
    });
  }
}

export default CommunicationService;

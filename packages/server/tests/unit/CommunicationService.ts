import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import mockery from "mockery";
import nodemailerMock from "nodemailer-mock";
import { testMentor, testParent, testStudent } from "../data";

// We need to setup the mocks before importing CommunicationService
// so nodemailer is actually mocked.
mockery.enable({ warnOnReplace: false, warnOnUnregistered: false });
// Replace all nodemailer calls with nodemailerMock
mockery.registerMock("nodemailer", nodemailerMock);

import CommunicationService, {
  CommunicationTemplates,
  MessageData,
} from "../../src/services/CommunicationService";
import CommunicationPreference from "../../src/models/CommunicationPreference";

chai.use(chaiAsPromised); // Allows us to handle promise rejections.
const expect = chai.expect;

afterEach(async () => {
  nodemailerMock.mock.reset();
});

after(async () => {
  mockery.deregisterAll();
  mockery.disable();
});

describe("🛰️ Communication Service ", () => {
  describe("::sendMessage()", () => {
    it("sends a email message", async () => {
      const template = CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR;

      const info = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "hello world",
      };

      await CommunicationService.sendMessage(testMentor, template, info);

      const sentMail = nodemailerMock.mock.getSentMail();
      expect(sentMail.length).to.be.equal(1);
    });

    it("enforces email data requirements", async () => {
      const template = CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR;
      const method = CommunicationPreference.EMAIL;
      const info = {
        mentor: testMentor,
        parent: testParent,
        message: "hello world",
      };
      const user = {
        ...testMentor,
        communicationPreference: method,
      };
      expect(CommunicationService.sendMessage(user, template, info)).to
        .eventually.be.rejected;
    });

    it("respects the communication preference", async () => {
      const template = CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR;
      const method = CommunicationPreference.SMS;
      const msgData: MessageData = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "hello! this is an SMS",
      };

      await CommunicationService.sendMessage(
        { ...testMentor, communicationPreference: method },
        template,
        msgData
      );

      const sentMail = nodemailerMock.mock.getSentMail();
      expect(sentMail.length).to.be.equal(0);
    });

    it("works on all email templates", async () => {
      const msgData: MessageData = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "This is a test email!",
      };
      const method = CommunicationPreference.EMAIL;
      let template: unknown;
      for (template in CommunicationTemplates) {
        await expect(
          CommunicationService.sendMessage(
            { ...testMentor, communicationPreference: method },
            template as CommunicationTemplates,
            msgData
          )
        ).to.eventually.not.be.rejected;
      }
    });

    it("blocks invalid emails", async () => {
      const template = CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR;
      const method = CommunicationPreference.EMAIL;
      const info = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "hello world",
      };
      const user = {
        ...testMentor,
        email: "florey@invalid@email.com",
        communicationPreference: method,
      };
      await expect(CommunicationService.sendMessage(user, template, info)).to
        .eventually.be.rejected;
    });

    it("sends a text message", async () => {
      const template = CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR;
      const method = CommunicationPreference.SMS;
      const info = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "hello world",
      };

      await CommunicationService.sendMessage(
        {
          ...testMentor,
          communicationPreference: method,
        },
        template,
        info
      );
    });

    it("enforces sms data requirements", async () => {
      const template = CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR;
      const method = CommunicationPreference.SMS;
      const info = {
        mentor: testMentor,
        message: "hello world",
      };
      const user = {
        ...testMentor,
        communicationPreference: method,
      };
      await expect(CommunicationService.sendMessage(user, template, info)).to
        .eventually.be.rejected;
    });

    it("blocks invalid phone numbers", async () => {
      const template = CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR;
      const method = CommunicationPreference.SMS;
      const info = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "hello world",
      };
      const user = {
        ...testMentor,
        phone: "1234",
        communicationPreference: method,
      };
      await expect(CommunicationService.sendMessage(user, template, info)).to
        .eventually.be.rejected;
    });

    it("works on all sms templates", async () => {
      const msgData: MessageData = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "This is a test SMS!",
      };
      let template: unknown;
      const user = {
        ...testMentor,
        phone: "1234",
        communicationPreference: CommunicationPreference.SMS,
      };
      for (template in CommunicationTemplates) {
        await expect(
          CommunicationService.sendMessage(
            user,
            template as CommunicationTemplates,
            msgData
          )
        ).to.eventually.not.be.rejected;
      }
    });

    it("ignores invalid but unused contact info", async () => {
      const template = CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR;
      const method = CommunicationPreference.EMAIL;
      const info = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "hello world",
      };
      const user = {
        ...testMentor,
        phone: "1234",
        communicationPreference: method,
      };
      await expect(CommunicationService.sendMessage(user, template, info)).to
        .not.eventually.be.rejected;
    });
  });
});

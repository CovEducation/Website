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

const TEST_EMAIL = "jack@bakerhouse.com";
const TEST_PHONE = "8572096179";

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
      const method = CommunicationPreference.EMAIL;
      const info = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "hello world",
      };

      await CommunicationService.sendMessage(
        TEST_EMAIL,
        template,
        method,
        info
      );

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

      expect(
        CommunicationService.sendMessage(TEST_EMAIL, template, method, info)
      ).to.eventually.be.rejected;
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
        TEST_PHONE,
        template,
        method,
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
      let template: unknown;
      for (template in CommunicationTemplates) {
        await expect(
          CommunicationService.sendMessage(
            TEST_EMAIL,
            template as CommunicationTemplates,
            CommunicationPreference.EMAIL,
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

      await expect(
        CommunicationService.sendMessage(
          "florey@invalid@email.com",
          template,
          method,
          info
        )
      ).to.eventually.be.rejected;
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
        TEST_PHONE,
        template,
        method,
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

      await expect(
        CommunicationService.sendMessage(TEST_PHONE, template, method, info)
      ).to.eventually.be.rejected;
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

      await expect(
        CommunicationService.sendMessage("1234", template, method, info)
      ).to.eventually.be.rejected;
    });

    it("works on all sms templates", async () => {
      const msgData: MessageData = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "This is a test SMS!",
      };
      let template: unknown;
      for (template in CommunicationTemplates) {
        await expect(
          CommunicationService.sendMessage(
            TEST_PHONE,
            template as CommunicationTemplates,
            CommunicationPreference.SMS,
            msgData
          )
        ).to.eventually.not.be.rejected;
      }
    });

    it("handles communication method mismatch", async () => {
      const template = CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR;
      const method = CommunicationPreference.EMAIL;
      const info = {
        mentor: testMentor,
        parent: testParent,
        student: testStudent,
        message: "hello world",
      };

      await expect(
        CommunicationService.sendMessage(TEST_PHONE, template, method, info)
      ).to.eventually.be.rejected;
    });
  });
});

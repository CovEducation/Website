import { mongoose } from "@typegoose/typegoose";
import { ISession } from "../../models/Sessions";
import MentorshipModel, {
  IMentorship,
  Mentorship,
  MentorshipState,
} from "../../models/Mentorships";
import { IParent } from "../../models/Parents";
import { IStudent } from "../../models/Students";
import { IMentor } from "../../models/Mentors";
import CommunicationService, {
  CommunicationTemplates,
} from "../CommunicationService";
import UserService from "../UserService";

export interface MentorshipRequest {
  parent: IParent;
  student: IStudent;
  mentor: IMentor;
  message: string;
}

/**
 * Responsible for creating, updating, and archiving mentorship information. Not responsible
 * for ensuring that the methods are called by the right type of user, or connecting to email / SMS services.
 *
 * A parent is the only type of user that can make mentorship requests in behalf of a student.
 * A student can only have one mentorship at any point in time. However, a student
 * can have multiple ongoing mentorship requests.
 *
 * A mentor can have multiple active mentorships at once. A mentor should be able to see / accept / reject any
 * mentorship request, but not make a mentorship request. Once a mentor accepts a student's request,
 * all the active requests made for the students will be automatically rejected.
 *
 * After a mentorship ends, it should be archived (not deleted!) so we can see mentorship patterns / engagement
 * metrics in the future.
 *
 */
class MentorshipService {
  /**
   * Sends a mentorship request to the chosen mentor, and a confirmation message to the parent. Takes into account the preferred communication method.
   * @param request contains information about members of the mentorship
   */
  public async sendRequest(request: MentorshipRequest): Promise<Mentorship> {
    return this.validateRequest(request).then(() => {
      if (request.message.length === 0) {
        return Promise.reject("Received empty mentorship request message.");
      }
      if (request.mentor._id === undefined) {
        return Promise.reject("Invalid mentor");
      }
      if (request.parent._id === undefined) {
        return Promise.reject("Invalid parent");
      }
      return MentorshipModel.create({
        state: MentorshipState.PENDING,
        student: request.student,
        mentor: request.mentor._id,
        parent: request.parent._id,
        sessions: [],
      }).then(async (mentorship) => {
        // TODO: Send welcome message.
        if (request.mentor._id === undefined) {
          return Promise.reject("Invalid mentor");
        }
        const mentor = await UserService.findMentor(request.mentor._id);
        await CommunicationService.sendMessage(
          mentor,
          CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR,
          request
        );
        return mentorship;
      });
    });
  }

  private async validateRequest(request: MentorshipRequest): Promise<void> {
    if (request.mentor._id === undefined) {
      return Promise.reject(`Mentor: ${request.mentor.name} has no _id`);
    }
    if (request.parent._id === undefined) {
      return Promise.reject(`Parent: ${request.parent.name} has no _id`);
    }
    if (await this.isStudentBeingMentored(request.student)) {
      return Promise.reject(
        `${request.student.name} is already being mentored.`
      );
    } else if (await this.isDuplicate(request)) {
      return Promise.reject("Duplicated request.");
    } else if (
      await this.hasStudentBeenRejectedByMentor(request.student, request.mentor)
    ) {
      return Promise.reject(
        `${request.student.name} has previous been rejected by ${request.mentor.name}`
      );
    } else {
      return Promise.resolve();
    }
  }

  private isStudentBeingMentored(student: IStudent) {
    return this.getStudentMentorships(student).then((mentorships) => {
      const activeReqs = mentorships.filter(
        (request) => request.state === MentorshipState.ACTIVE
      );
      return activeReqs.length > 0;
    });
  }

  private hasStudentBeenRejectedByMentor(student: IStudent, mentor: IMentor) {
    return this.getStudentMentorships(student).then((mentorships) => {
      const reqsToMentor = mentorships.filter((req) => {
        return (
          (req.mentor === mentor || req.mentor === mentor._id) &&
          req.state === MentorshipState.REJECTED
        );
      });
      return reqsToMentor.length > 0;
    });
  }

  private isDuplicate(request: MentorshipRequest) {
    return MentorshipModel.find({
      student: request.student._id,
      mentor: request.mentor._id,
      state: MentorshipState.PENDING,
    }).then((docs) => {
      return docs.length > 0;
    });
  }

  private getStudentMentorships(student: IStudent) {
    if (student._id === undefined) {
      throw new Error(
        `Cannot get mentorships for student not in database: ${student.name}`
      );
    }
    return this.getCurrentMentorships(student._id);
  }

  public getCurrentMentorships(userId: mongoose.Types.ObjectId) {
    return MentorshipModel.find({
      $or: [{ student: userId }, { parent: userId }, { mentor: userId }],
    });
  }
  /**
   * Assumes that the mentorship is being accepted by request of the mentor. A mentorship can only be accepted if it is in the PENDING state. A mentorship cannot be accepted more than once - a new mentorship request should be archived before being renewed.
   * @param mentorship to be accepted.
   */
  public acceptRequest(mentorship: IMentorship) {
    if (mentorship._id === undefined) {
      return Promise.reject("Missing mentorship._id");
    }
    return MentorshipModel.findOne(mentorship._id)
      .then((doc) => {
        if (doc === null) {
          throw new Error(`Mentorship does not exist: ${mentorship._id}`);
        }
        if (doc.state !== MentorshipState.PENDING) {
          throw new Error(
            `Cannot accept mentorship that is not pending: ${doc.state}`
          );
        }
        doc.startDate = new Date();
        doc.state = MentorshipState.ACTIVE;

        // TODO: Send acceptance message.
        return doc.save();
      })
      .then(() => this.rejectOtherRequestsMadeForStudent(mentorship));
  }

  /**
   * Assumes that the mentorship is being rejected by request of the mentor. A mentorship can only be rejected once, double-rejection will throw an error. A mentorship cannot be accepted afterwards - a new mentorship request should be sent if the mentorship should be reactivated.
   * @param mentorship to be rejected.
   */
  public rejectRequest(mentorship: IMentorship) {
    if (mentorship._id === undefined) {
      throw new Error(`Cannot reject non-existent mentorship`);
    }
    return MentorshipModel.findById(mentorship._id).then((doc) => {
      if (doc === null) {
        throw new Error(`Failed to find mentorship: ${mentorship._id}`);
      }
      if (doc.state !== MentorshipState.PENDING) {
        throw new Error(
          `Cannot reject mentorship that is not pending: ${doc._id}`
        );
      }
      doc.state = MentorshipState.REJECTED;

      // TODO(external) - Ask Dheekshu if it makes sense to not send a message?
      return doc.save();
    });
  }

  private async rejectOtherRequestsMadeForStudent(mentorship: IMentorship) {
    // mentorship.student is an ObjectId if mentorship has not been populated.
    const otherMentorships = await MentorshipModel.find({
      student: mentorship.student,
    }).then((mentorships) =>
      mentorships.filter((v) => v.id !== mentorship._id)
    );

    return Promise.all(
      otherMentorships.map((m) => {
        if (m.state === MentorshipState.PENDING && m.id !== mentorship._id) {
          return this.rejectRequest(m);
        }
        return Promise.resolve(m);
      })
    ).then(() => {});
  }

  public archiveMentorship(mentorship: IMentorship) {
    if (mentorship._id === undefined) {
      return Promise.reject("Cannot archive non-existent mentorship");
    }
    return MentorshipModel.findById(mentorship._id).then((doc) => {
      if (doc === null) {
        throw new Error(`Failed to find mentorship: ${mentorship._id}`);
      }
      if (doc.state !== MentorshipState.ACTIVE) {
        throw new Error(`Cannot archive inactive mentorship`);
      }
      doc.endDate = new Date();
      doc.state = MentorshipState.ARCHIVED;
      // TODO(management) - End of mentorship survey?
      return doc.save();
    });
  }

  /**
   * A session can only be added to an ACTIVE mentorship.
   */
  public addSessionToMentorship(session: ISession, mentorship: Mentorship) {
    if (mentorship._id === undefined) {
      throw new Error("Missing mentorship._id");
    }
    if (session.rating > 1 || session.rating < 0) {
      throw new Error(`Session rating out of range: ${session.rating}`);
    }
    return MentorshipModel.findById(mentorship._id).then((doc) => {
      if (doc === null) {
        throw new Error(`Failed to find mentorship ${mentorship._id}`);
      }
      if (doc.state !== MentorshipState.ACTIVE) {
        throw new Error(
          `Attempting to add a session to an inactive mentorship: ${doc._id}`
        );
      }
      doc.sessions.push(session);
      return doc.save();
    });
  }
}

export default MentorshipService;

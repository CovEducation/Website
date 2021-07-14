import find from 'find-up';
import dotenv from 'dotenv';
import prompts from 'prompts';
import ParentModel from '../models/Parents';
import { mongoose } from '@typegoose/typegoose';
import { Student } from '../models/Students';
import MentorModel from '../models/Mentors';
import MentorshipService, { MentorshipRequest } from '../services/MentorshipService';
import { exit } from 'yargs';

const envPath = find.sync('.env');
dotenv.config({path: envPath});
const { MONGO_URI,   DB_NAME } = process.env;

if (MONGO_URI === undefined || DB_NAME === undefined) {
    throw new Error("Missing environment keys");
}

const setup = () => {
    return mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: DB_NAME
    });
}

const main = async () => {
    // Prompt for parent info
    const { parentEmail } = await prompts({
        type: 'text',
        name: 'parentEmail',
        message: 'Email of the parent requesting the mentorship',
        validate: async (parentEmail) => {
            const doc =  await ParentModel.findOne({email: parentEmail });
            if (doc === null) {    
                return `${parentEmail} does not exist. Typo?`;
            }
            return true;
        }
    });
    const parent = await retrieveParentData(parentEmail);
    const students = parent.students;
    // Find the correct student_id 
    const { selectedStudent } = await prompts({
        type: 'select',
        name: 'selectedStudent',
        message: 'Which student are you requesting a mentorship for',
        choices: students.map((s: Student) => {
            return {
                title: s.name,
                value: s
            };
        }),
    });
    // Find mentor 
    const { mentorEmail } = await prompts({
        type: 'text',
        name: 'mentorEmail',
        message: 'Mentor\'s email',
        validate: async (mentorEmail) => {
            const doc =  await MentorModel.findOne({email: mentorEmail });
            if (doc === null) {    
                return `${mentorEmail} does not exist. Typo?`;
            }
            return true;
        }
    });
    const mentor = await retrieveMentorData(mentorEmail);
    // Ask for the message 
    const { message } = await prompts({
        type: 'text',
        name: 'message',
        message: 'Message for the mentor about this request: ', 
        validate: msg => msg.length > 0,
    });
    const request: MentorshipRequest = {
        student: selectedStudent,
        parent,
        mentor,
        message,
    };

    const { proceed } = await prompts({
        type: 'toggle',
        name: 'proceed',
        message: generateConfirmationMsg(request),
        initial: true,
        active: 'yes',
        inactive: 'no'
    });
    if (!proceed) {
        exit(1, new Error('Aborted operation.'));
    }
    
    await MentorshipService.sendRequest(request).then(() => {
        console.log("Succesfully sent request ~");
    })
    exit(0, new Error())

}

const generateConfirmationMsg = (request: MentorshipRequest) => {
    return `Preparing to send a mentorship request to ${request.mentor.name} (${request.mentor.name}) for ${request.student.name} on behalf of ${request.parent.name} (${request.parent.email}) with the message:\n\t${request.message} \n
Does that sound correct?`
}

const retrieveParentData = (parentEmail: string) => {
    return ParentModel.findOne({email: parentEmail}).then((doc) => {
        if (doc === null) {
            throw new Error(`Could not find ${parentEmail} in the database.`);
        }
        return doc;
    });
};

const retrieveMentorData = (mentorEmail: string) => {
    return MentorModel.findOne({email:mentorEmail}).then((doc) => {
        if (doc === null) {
            throw new Error(`Could not find ${mentorEmail} in the database.`);
        }
        return doc;
    });
};

setup().then(() => {
    console.clear(); // Typegoose sometimes has warnings.
    main();
});

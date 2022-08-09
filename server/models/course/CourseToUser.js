const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../user/User');
const Course = require('./Course');
const Section = require('./Section');

// Schema for course-to-user

const courseToUserSchema = new Schema({

    user: {type: Schema.Types.ObjectId, ref: User, required: true},
    courses: [
        {
            code: String,
            completedSections: [String], // list of section ids
        },
    ],

}, { timestamps: true });

// Create model for course-to-user

const CourseToUser = mongoose.model('course-to-user', courseToUserSchema);

const getCourseToUser = async userId => {
    const courseToUser = 
        await CourseToUser
            .findOne({ user: userId });
    if(courseToUser) return courseToUser;
    // console.log(courseToUser);
    const user = await User.findOne({_id: userId});
    if(!courseToUser){
        console.log(`create new course-to-user for ${userId}`);
        const newCourseToUser = new CourseToUser({
            user,
            courses: ['22S1_EH', '22S1_NS', '22S1_CP', '22S1_PROID', '22S1_FP'].map(code => {
                return { code, completedSections: [], };
            }),
        });
        const result = await newCourseToUser.save();
        console.log(result);
        return result;
    }
}

module.exports = { CourseToUser, getCourseToUser };
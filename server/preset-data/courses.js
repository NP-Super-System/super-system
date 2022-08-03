const Course = require('../models/course/Course');
const Section = require('../models/course/Section');
const Announcement = require('../models/announcement/Announcement');

// TO BE ONLY RUN ONCE

// init course data

const courseList = [
    // ethical hacking
    {
        code: '22S1_EH',
        name: 'Ethical Hacking',
        imgKey: 'course/22S1_EH.jpeg',
        sections: [...Array(18).keys()].map(weekNum => {
            return new Section({
                title: `Week ${weekNum+1}`,
                files: [],
                hasChallenge: true,
            });
        }),
        annoucements: [

        ],
    },

    // network security
    {
        code: '22S1_NS',
        name: 'Network Security',
        imgKey: 'course/22S1_NS.jpeg',
        sections: [...Array(18).keys()].map(weekNum => {
            return new Section({
                title: `Week ${weekNum+1}`,
                files: [],
                hasChallenge: true,
            });
        }),
        annoucements: [
            
        ],
    },

    // capstone project
    {
        code: '22S1_CP',
        name: 'Capstone Project',
        imgKey: 'course/22S1_CP.jpeg',
        sections: [
            new Section({
                title: 'Module information',
                files: [],
            }),
            new Section({
                title: 'Helpful Materials',
                files: [],
            }),
        ],
        annoucements: [
            
        ],
    },

    // project id
    {
        code: '22S1_PROID',
        name: 'Project ID - Connecting the Dots',
        imgKey: 'course/22S1_PROID.jpeg',
        sections: [
            new Section({
                title: 'Module Information',
                files: [],
            }),
            new Section({
                title: 'Assessment 1',
                files: [],
            }),
            new Section({
                title: 'Assessment 2',
                files: [],
            }),
            new Section({
                title: 'Assessment 3',
                files: [],
            }),
            new Section({
                title: 'Assessment 4',
                files: [],
            }),
        ],
        annoucements: [
            
        ],
    },

    // fp3
    {
        code: '22S1_FP',
        name: 'Fundamentals for IT Professionals',
        imgKey: 'course/22S1_FP.jpeg',
        sections: [
            new Section({
                title: 'Assessment 1',
                files: [],
            }),
            new Section({
                title: 'Assessment 2',
                files: [],
            }),
            new Section({
                title: 'Assessment 3',
                files: [],
            }),
        ],
        annoucements: [
            
        ],
    },
];

// add courses

async function addCourses(){
    for (var courseData of courseList){
        console.log(courseData);
        const course = new Course(courseData);
        try{
            const result = await course.save();
            console.log(`Added course: ${result.name} | ${result.code}`)
        }
        catch(err){
            console.log(err);
        }
        finally{
            continue;
        }
    }
}

addCourses();
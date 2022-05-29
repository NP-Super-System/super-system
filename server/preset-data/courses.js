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
        sections: [
            new Section({
                title: 'Week 1',
                files: [],
            }),
            new Section({
                title: 'Week 2',
                files: [],
            }),
            new Section({
                title: 'Week 3',
                files: [],
            }),
        ],
        annoucements: [

        ],
    },

    // network security
    {
        code: '22S1_NS',
        name: 'Network Security',
        imgKey: 'course/22S1_NS.jpeg',
        sections: [
            new Section({
                title: 'Week 1',
                files: [],
            }),
            new Section({
                title: 'Week 2',
                files: [],
            }),
            new Section({
                title: 'Week 3',
                files: [],
            }),
        ],
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
                title: 'Week 1',
                files: [],
            }),
            new Section({
                title: 'Week 2',
                files: [],
            }),
            new Section({
                title: 'Week 3',
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
                title: 'Week 1',
                files: [],
            }),
            new Section({
                title: 'Week 2',
                files: [],
            }),
            new Section({
                title: 'Week 3',
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
                title: 'Week 1',
                files: [],
            }),
            new Section({
                title: 'Week 2',
                files: [],
            }),
            new Section({
                title: 'Week 3',
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
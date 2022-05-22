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
        sections: [
            new Section({
                title: 'Week 1',
            }),
            new Section({
                title: 'Week 2',
            }),
            new Section({
                title: 'Week 3',
            }),
        ],
        annoucements: [

        ],
    },

    // network security
    {
        code: '22S1_NS',
        name: 'Network Security',
        sections: [
            new Section({
                title: 'Week 1',
            }),
            new Section({
                title: 'Week 2',
            }),
            new Section({
                title: 'Week 3',
            }),
        ],
        annoucements: [
            
        ],
    },

    // capstone project
    {
        code: '22S1_CP',
        name: 'Capstone Project',
        sections: [
            new Section({
                title: 'Week 1',
            }),
            new Section({
                title: 'Week 2',
            }),
            new Section({
                title: 'Week 3',
            }),
        ],
        annoucements: [
            
        ],
    },

    // project id
    {
        code: '22S1_PROID',
        name: 'Project ID - Connecting the Dots',
        sections: [
            new Section({
                title: 'Week 1',
            }),
            new Section({
                title: 'Week 2',
            }),
            new Section({
                title: 'Week 3',
            }),
        ],
        annoucements: [
            
        ],
    },

    // fp3
    {
        code: '22S1_FP',
        name: 'Fundamentals for IT Professionals',
        sections: [
            new Section({
                title: 'Week 1',
            }),
            new Section({
                title: 'Week 2',
            }),
            new Section({
                title: 'Week 3',
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
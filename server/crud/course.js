const Course = require('../models/course/Course');
const Section = require('../models/course/Section');

// CRUD operations

const operations = app => {
    // Create - add course
    
    // Read - get courses

    // All courses
    const readAllCourses = async res => {
        Course.find({})
            .then(result => res.send(result))
            .catch(err => console.log(err));
    }
    app.get('/course/read/', async (req, res) => {
        await readAllCourses(res);
    });
    // Individual course
    const readCourse = async (res, code) => {
        Course.findOne({code})
            .then(result => res.send(result))
            .catch(err => console.log(err));
    }
    app.get('/course/read/:courseCode', async (req, res) => {
        const { courseCode } = req.params;
        await readCourse(res, courseCode);
    });

    // Update - update course

    // Delete - delete course

}

module.exports = operations;
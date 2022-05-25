const multer = require('multer');
const uploadLocal = multer({dest: './uploads/'});
const { uploadFile } = require('../s3');
const Course = require('../models/course/Course');
const Section = require('../models/course/Section');
const File = require('../models/course/File');

const appUrl = 'http://localhost:3000';

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

    // Add file to section
    const updateCourseSection = async (res, courseId, courseCode, sectionId, fileName, fileKey) => {
        const course = await Course.findOne({_id: courseId});
        const [section] = course.sections.filter(section => section._id == sectionId);
        console.log(section);
        const fileDetails = new File({
            name: fileName,
            key: fileKey,
        }); 
        section.files.push(fileDetails);
        const result = await course.save();
        res.redirect(`${appUrl}/home/course/${courseCode}`);
    }

    app.post('/course/update/section', uploadLocal.single('file'), async (req, res) => {
        const { courseId, courseCode, sectionId } = req.body;
        let fileKey = '';
        try{
            const uploadFileRes = await uploadFile(req.file, 'file');
            fileKey = uploadFileRes.key || '';
        }
        catch(err){
            console.log(err);
        }

        await updateCourseSection(res, courseId, courseCode, sectionId, req.file.originalname, fileKey);
    });

    // Delete - delete course

}

module.exports = operations;
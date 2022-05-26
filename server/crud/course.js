const fs = require('fs');
const multer = require('multer');
const uploadLocal = multer({dest: __dirname + '/../uploads/'});
const { uploadFile, deleteFile } = require('../s3');
const Course = require('../models/course/Course');
const Section = require('../models/course/Section');
const File = require('../models/course/File');

const appUrl = 'http://localhost:3000';

// CRUD operations

const operations = app => {
    // Create
    
    // Read

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
    const getCourse = async code => {
        return await Course.findOne({code});
    }
    const readCourse = async (res, code) => {
        try{
            const course = await getCourse(code);
            res.send(course);
        }
        catch(err){
            console.log(err);
            res.send({});
        }
    }
    app.get('/course/read/:courseCode', async (req, res) => {
        const { courseCode } = req.params;
        await readCourse(res, courseCode);
    });
    // Individual course section
    const readSection = async (res, courseCode, sectionId) => {
        try{
            const course = await getCourse(courseCode);
            const [section] = course.sections.filter(section => section._id == sectionId);
            res.send(section);
        }
        catch(err){
            console.log(err);
            res.send({});
        }
    }
    app.get('/course/read/:courseCode/:sectionId', async (req, res) => {
        const { courseCode, sectionId } = req.params;
        await readSection(res, courseCode, sectionId);
    });

    // Update

    // Add file to section
    const updateCourseSection = async (res, courseCode, sectionId, fileName, fileKey) => {
        const course = await getCourse(courseCode);
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
        const { courseCode, sectionId } = req.body;
        let fileKey = '';
        try{
            const uploadFileRes = await uploadFile(req.file, 'file');
            fileKey = uploadFileRes.key || '';

            console.log(fileKey);
            fs.unlinkSync(__dirname + `/../uploads/${fileKey}`);
        }
        catch(err){
            console.log(err);
        }

        await updateCourseSection(res, courseCode, sectionId, req.file.originalname, fileKey);
    });

    // Delete

    // Delete course section file
    const deleteCourseSectionFile = async (res, courseCode, sectionId, fileKey) => {
        const course = await getCourse(courseCode);
        const [section] = course.sections.filter(section => section._id == sectionId);
        
        const fileIndex = section.files.map(file => file.key).indexOf(fileKey);
        section.files.splice(fileIndex, 1);
        
        const result = await course.save();
        res.redirect(`${appUrl}/home/course/${courseCode}/${sectionId}`);
    }

    app.post('/course/delete/section/file/', async (req, res) => {
        const { courseCode, sectionId, fileKey } = req.body;
        await deleteFile(fileKey, 'file');
        await deleteCourseSectionFile(res, courseCode, sectionId, fileKey);
    });

}

module.exports = operations;
const fs = require('fs');
const multer = require('multer');
const uploadLocal = multer({dest: __dirname + '/../uploads/'});
const { uploadFile, deleteFile } = require('../s3');
const Course = require('../models/course/Course');
const Section = require('../models/course/Section');
const File = require('../models/course/File');
const Text = require('../models/course/Text');

const User = require('../models/user/User');
const { CourseToUser, getCourseToUser } = require('../models/course/CourseToUser');

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

    // Get indiv user progress for course
    app.get('/course/progress/read', async(req, res) => {
        const { userId } = req.query;

        console.log('get course to user');
        const courseToUser = await getCourseToUser(userId);

        let courseProgress = [];
        for (var course of courseToUser.courses){
            const { code, completedSections } = course;
            console.log(`get progress for ${code}`);

            const completedCount = completedSections.length;
            console.log({completedCount});

            const { sections } = await Course.findOne({code});
            const totalCount = sections.filter(sec => sec.hasChallenge).length;
            console.log({totalCount});

            const progress = 
                totalCount ?
                Math.floor((completedCount / totalCount) * 100) :
                100;

            console.log({code, progress});
            courseProgress.push({code, progress});
        }

        res.send(courseProgress);
    });

    app.get('/course/user/read', async(req, res) => {
        const { userId } = req.query;
        try{
            const courseToUser = await getCourseToUser(userId);
            res.send(courseToUser);
        }
        catch(err){
            console.log(err);
            res.send({err});
        }
    })

    // Update

    // Add file to section
    const addFileToSection = async (res, courseCode, sectionId, fileName, fileKey) => {
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

    app.post('/course/update/section/file', uploadLocal.single('file'), async (req, res) => {
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

        await addFileToSection(res, courseCode, sectionId, req.file.originalname, fileKey);
    });

    // Add text to section

    const addTextToSection = async (res, courseCode, sectionId, text) => {
        const course = await getCourse(courseCode);
        const [section] = course.sections.filter(section => section._id == sectionId);
        console.log(section);
        
        const textDetails = new Text({
            text,
        });
        section.textList.push(textDetails);

        const result = await course.save();
        res.send(result);
    }

    app.post('/course/update/section/text', async (req, res) => {
        const { courseCode, sectionId, text } = req.body;
        await addTextToSection(res, courseCode, sectionId, text);
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
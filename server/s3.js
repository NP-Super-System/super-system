const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();

const s3Buckets = {
    image: {
        name: process.env.AWS_IMAGE_BUCKET_NAME,
        instance: new S3({
            region: process.env.AWS_IMAGE_BUCKET_REGION,
            accessKeyId: process.env.AWS_IMAGE_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_IMAGE_SECRET_ACCESS_KEY,
        }),
    },
    file: {
        name: process.env.AWS_FILE_BUCKET_NAME,
        instance: new S3({
            region: process.env.AWS_FILE_BUCKET_REGION,
            accessKeyId: process.env.AWS_FILE_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_FILE_SECRET_ACCESS_KEY,
        }),
    },
}

// upload file to s3

function uploadFile(file, bucketType){
    const bucket = s3Buckets[bucketType];
    
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucket.name,
        Body: fileStream,
        Key: file.filename,
    }

    return bucket.instance.upload(uploadParams).promise();
}

// delete file locally
function deleteLocalFile(fileKey){
    try{
        fs.unlinkSync(`./uploads/${fileKey}`);
    }
    catch(err){
        console.log(err);
    }
}

// download file from s3

function getFileStream(fileKey, bucketType){
    const bucket = s3Buckets[bucketType];

    const downloadParams = {
        Key: fileKey,
        Bucket: bucket.name,
    }

    return bucket.instance.getObject(downloadParams).createReadStream();
}

// delete file from s3 bucket

function deleteFile(fileKey, bucketType){
    const bucket = s3Buckets[bucketType];

    const deleteParams = {
        Bucket: bucket.name,
        Key: fileKey,
    }

    bucket.instance.deleteObject(deleteParams, (err, data) => {
        if (err) console.log(err)
        else console.log(data);
    });
}

module.exports = { uploadFile, getFileStream, deleteFile, deleteLocalFile };
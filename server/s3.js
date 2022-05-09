const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();

const bucketName = process.env.AWS_BUCKET_NAME;
const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// upload file to s3

function uploadFile(file){
    console.log(file);
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    }

    return s3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile;

// download file from s3

function getFileStream(fileKey){
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    }

    return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream;
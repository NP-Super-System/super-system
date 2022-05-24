const { getFileStream } = require('../s3');

const operations = app => {
    // Read - get image from aws s3 "images" bucket
    // Get image from s3
    app.get('/get-image/:key', (req, res) => {
        const { key } = req.params;
        try{
            const readStream = getFileStream(key, 'image');
            readStream.pipe(res);
        }
        catch(err){console.log(err);}
    });

    // Get file from s3
    app.get('/s3/file/:key', (req, res) => {
        const { key } = req.params;
        try{
            const readStream = getFileStream(key, 'file');
            readStream.pipe(res);
        }
        catch(err){console.log(err);}
    });
}

module.exports = operations;
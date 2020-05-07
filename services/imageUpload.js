var upload = {};
upload.imageUpload = function(file, callback) {
    if (typeof file == undefined || typeof file == null || file == "" || file == 'undefined') {
        var image1 = { secure_url: null }
        callback(null, image1);
    } else {
        const cloudinary = require('cloudinary').v2
        cloudinary.config({
            cloud_name: 'df2g41fhw',
            api_key: '256778662438995',
            api_secret: 'ufJtkTlSDttDwFWJwtH2G6bWmFw'
        })
        // let path = (file.file && file.file.path) ? file.file.path : file.path;
        let path = file.path
        const uniqueFilename = new Date().toISOString()
        cloudinary.uploader.upload(
            path, { public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
            function(err, image) {
                if (err) {
                    callback(err, null);
                    console.log(err);
                } else {
                    const fs = require('fs');
                    fs.unlinkSync(__dirname + '/../' + path);
                    callback(null, image);
                }
            }
        )
    }

}

module.exports = upload;
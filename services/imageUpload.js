var upload = {};
upload.imageUpload = function (file, callback) {
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

        // Upload il buffer direttamente a Cloudinary
        const uniqueFilename = new Date().toISOString()

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: `blog/${uniqueFilename}`,
                tags: `blog`
            },
            function (err, image) {
                if (err) {
                    callback(err, null);
                    console.log(err);
                } else {
                    callback(null, image);
                }
            }
        );

        // Scrivi il buffer nel stream
        uploadStream.end(file.buffer);
    }
}

module.exports = upload;

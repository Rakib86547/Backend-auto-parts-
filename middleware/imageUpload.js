const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: 'files/',
    filename: (req, file, cb) => {
        console.log('file =', file)
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() + 1E9)
        console.log('file name =', file.originalname)
        cb(null, file.originalname);
    }
});

const imageUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const supportFile = /jpg|png/; // Supported file types
        const extension = path.extname(file.originalname).toLocaleLowerCase();
        console.log('extension =', extension);
        if (supportFile.test(extension)) {
            cb(null, true); // Accept file
        } else {
            cb(new Error(`Unsupported file types: ${extension}. Only .jpg & .png supported`))
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
});

module.exports = imageUpload
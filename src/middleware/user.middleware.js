const multer = require('multer');
const uniqid = require('uniqid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        const uniqueImage = uniqid('Image-',`-${file.originalname}`);
        cb(null, uniqueImage);
    }
})


const upload = multer({ storage: storage });

module.exports = upload;
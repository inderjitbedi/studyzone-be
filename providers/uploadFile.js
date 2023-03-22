const util = require("util");
const multer = require("multer");
const constants = require("../enum/constants");
const fs = require('fs-extra');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let path = `temp`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname.replaceAll(' ', '_'));
    },
    limits: (req, file, cb) => {
        const fileConfig = constants[req.params.type.toUpperCase() + '_CONFIG'];
        cb(null, { fileSize: fileConfig.MAX_SIZE })
    },
});

const uploadFile = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileConfig = constants[req.params.type.toUpperCase() + '_CONFIG'];
        const filetypes = fileConfig.ALLOWED_EXTENSIONS_REGEX;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype&& extname) {  
            return cb(null, true);
        } else {
            cb(new Error(`Error: File must be of type ${fileConfig.ALLOWED_EXTENSIONS}!`));
        }
    }
})
module.exports = uploadFile;



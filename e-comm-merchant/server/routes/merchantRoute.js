const express = require('express');
const router = express.Router();

const { registerMerchant } = require('../controller/MerchantController');

const multer = require('multer');

const st = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniq = Math.floor(Math.random() * 100000000);
        cb(null, `${file.fieldname}-${uniq}`);
    }
});

const upload = multer({ storage: st }).single('profilePic');



router.post('/registerMerchant', upload, registerMerchant);

module.exports = router;

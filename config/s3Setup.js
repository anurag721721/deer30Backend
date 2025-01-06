require('dotenv').config(); // Load environment variables from .env

const multer = require('multer');
const { S3 } = require('@aws-sdk/client-s3');
const path = require('path');

// Initialize S3 client with credentials from environment variables
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS Access Key from .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Access Key from .env
  },
  region: process.env.AWS_REGION, // AWS Region from .env
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed. Only JPEG, JPG, PNG, and PDF are allowed.'));
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit to 10MB per file
}).array('images', 10);

const uploadToS3 = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    try {
      const fileLocations = [];

      for (const file of req.files) {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME, // Bucket name from .env
          Key: `${Date.now()}-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        await s3.putObject(params); // Upload file to S3
        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

        fileLocations.push(fileUrl);
      }

      req.fileLocations = fileLocations; // Attach file locations to request
      next(); // Proceed to next middleware
    } catch (uploadError) {
      return res.status(500).send(uploadError.message);
    }
  });
};

module.exports = { uploadToS3 };

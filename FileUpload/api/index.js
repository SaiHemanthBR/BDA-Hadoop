require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const app = express()
const port = process.env.API_PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello, World!")
})

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
  },
});

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

app.post('/api/upload', uploader.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).send('No file uploaded.')
      return
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    })

    blobStream.on('error', (err) => next(err))
    
    blobStream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`
      res.status(200).send({ 
        fileName: req.file.originalname,
        fileLocation: publicUrl
      })
    })
    
    blobStream.end(req.file.buffer)
  } catch (error) {
    res.status(400).send(`Error, could not upload file: ${error}`)
    return
  }
})

app.listen(port, () => console.log(`File uploader API listening on port ${port}`))
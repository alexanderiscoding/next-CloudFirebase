import { bucket } from '../../../firebase';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  // parse form with a Promise wrapper
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    });
  });
  return bucket.upload(data.files.file.filepath, {
    destination: (data.fields.location + data.files.file.originalFilename),
    contentType: data.files.file.mimetype
  }).then((data) => {
    res.status(200).json(data[0].metadata);
  }).catch((error) => {
    res.status(500).json(error);
  });
}

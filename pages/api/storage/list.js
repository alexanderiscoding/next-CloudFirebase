import { bucket, storage } from '../../../firebase';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  let listFiles = [];
  if (req.body.bucket) {
    const [files] = await storage.bucket(req.body.bucket).getFiles();

    files.forEach(file => {
      listFiles.push(file.name);
    });

    res.status(200).json(listFiles);
  } else {
    const [files] = await bucket.getFiles();

    files.forEach(file => {
      listFiles.push(file.name);
    });

    res.status(200).json(listFiles);
  }
}

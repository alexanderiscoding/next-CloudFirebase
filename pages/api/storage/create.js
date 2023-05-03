import { bucket } from '../../../firebase';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.content].includes(undefined)) {
    return res.status(406).json("Missing Content Param");
  }
  let location;
  if (req.body.location) {
    location = req.body.location;
  } else {
    if ([req.body.extension].includes(undefined)) {
      return res.status(406).json("Missing Extension Param");
    }
    const { createHash } = await import('node:crypto');
    const hash = createHash('sha256');
    hash.update(String(Date.now()));
    location = String(hash.copy().digest('hex')) + req.body.extension;
  }
  return bucket.file(location).save(req.body.content).then(() => {
    res.status(200).send("File saved successfully.");
  }).catch((error) => {
    res.status(500).json(error);
  });
}
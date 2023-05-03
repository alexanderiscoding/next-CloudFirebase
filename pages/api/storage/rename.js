import { bucket } from '../../../firebase';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.location, req.body.newLocation].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  return bucket.file(req.body.location).rename(req.body.newLocation, {
    preconditionOpts: {
      ifGenerationMatch: 0
    }
  }).then(() => {
    res.status(200).json("File renamed successfully.");
  }).catch((error) => {
    res.status(500).json(error);
  });
}
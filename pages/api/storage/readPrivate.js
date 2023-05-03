import { bucket } from '../../../firebase';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.location, req.body.expires].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  return bucket.file(req.body.location).getSignedUrl({
    action: 'read',
    expires: req.body.expires
  }).then((data) => {
    res.status(200).json(data[0]);
  }).catch((error) => {
    res.status(500).json(error);
  });
}
import { storage, bucket } from '../../../firebase';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if (req.body.otherBucket) {
    if ([req.body.destBucket, req.body.destFile, req.body.srcBucket, req.body.srcFile].includes(undefined)) {
      return res.status(406).json("Missing Body Params");
    }
    const copyDestination = storage.bucket(req.body.destBucket).file(req.body.destFile);
    return storage.bucket(req.body.srcBucket).file(req.body.srcFile).copy(copyDestination, {
      preconditionOpts: {
        ifGenerationMatch: 0
      }
    }).then(() => {
      res.status(200).json(`${req.body.srcBucket}/${req.body.srcFile} copied to ${req.body.destBucket}/${req.body.destFile}`);
    }).catch((error) => {
      res.status(500).json(error);
    });
  } else {
    if ([req.body.location, req.body.newLocation].includes(undefined)) {
      return res.status(406).json("Missing Body Params");
    }
    return bucket.file(req.body.location).copy(req.body.newLocation, {
      preconditionOpts: {
        ifGenerationMatch: 0
      }
    }).then(() => {
      res.status(200).json("File copied successfully.");
    }).catch((error) => {
      res.status(500).json(error);
    });
  }
}

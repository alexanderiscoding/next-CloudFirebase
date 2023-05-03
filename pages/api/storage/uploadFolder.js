import { bucket } from '../../../firebase';

const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function* getFiles(directory = '.') {
  for (const file of await readdir(directory)) {
    const fullPath = path.join(directory, file);
    const stats = await stat(fullPath);
    if (stats.isDirectory()) {
      yield* getFiles(fullPath);
    }
    if (stats.isFile()) {
      yield fullPath;
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.directoryPath, req.body.location].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  let successfulUploads = 0;
  for await (const filePath of getFiles(req.body.directoryPath)) {
    try {
      const fileName = path.basename(filePath);
      await bucket.upload(filePath, {
        destination: (req.body.location + fileName)
      });
      successfulUploads++;
    } catch (error) {
      res.status(500).json(`Error uploading ${filePath}:`, error);
    }
  }
  res.status(200).json(`${successfulUploads} files uploaded successfully.`);
}

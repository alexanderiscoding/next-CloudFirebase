import { database } from '../../../firebase';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.name, req.body.id, req.body.column].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  const ref = database.ref(req.body.name);
  const columnRef = ref.child(req.body.id);
  return columnRef.update(req.body.column, (error) => {
    if (error) {
      return res.status(500).json(error);
    } else {
      return res.status(200).json('Data updated successfully.');
    }
  });
}
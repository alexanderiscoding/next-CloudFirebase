import { firestore } from '../../../firebase';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if (req.body.column.where === "true") {
    if ([req.body.table.name, req.body.column.name, req.body.column.operator, req.body.column.value].includes(undefined)) {
      return res.status(406).json("Missing Body Params");
    }
    const table = firestore.collection(req.body.table.name);
    const snapshot = await table.where(req.body.column.name, req.body.column.operator, req.body.column.value).get();
    if (snapshot.empty) {
      return res.status(404).json("No matching documents.");
    }
    let alldocdata = [];
    snapshot.forEach(doc => {
      let singleObj = {};
      singleObj['id'] = doc.id;
      singleObj['data'] = doc.data();
      alldocdata.push(singleObj);
    });
    return res.status(200).json(alldocdata);
  } else {
    if ([req.body.table.name, req.body.column.id].includes(undefined)) {
      return res.status(406).json("Missing Body Params");
    }
    const docTable = firestore.collection(req.body.table.name).doc(req.body.column.id);
    const doc = await docTable.get();
    if (!doc.exists) {
      return res.status(404).json("No such document!");
    } else {
      return res.status(200).json(doc.data());
    }
  }
}
import { firestore } from '../../../firebase';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if (req.body.column.where === "true") {
    if (req.body.column.timestamp == 0) {
      if ([req.body.table.name, req.body.column.name, req.body.column.operator, req.body.column.value, req.body.column.limit].includes(undefined)) {
        return res.status(406).json("Missing Body Params");
      }
      const snapshot = await firestore.collection(req.body.table.name)
        .where(req.body.column.name, req.body.column.operator, req.body.column.value)
        .orderBy('timestamp')
        .limit(req.body.column.limit)
        .get();
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
      let singleObj = {};
      singleObj['next'] = snapshot.docs[snapshot.docs.length - 1].data().timestamp;
      singleObj['data'] = alldocdata;
      let docdata = [];
      docdata.push(singleObj);
      return res.status(200).json(docdata);
    } else {
      if ([req.body.table.name, req.body.column.name, req.body.column.operator, req.body.column.value, req.body.column.timestamp, req.body.column.limit].includes(undefined)) {
        return res.status(406).json("Missing Body Params");
      }
      const snapshot = await firestore.collection(req.body.table.name)
        .where(req.body.column.name, req.body.column.operator, req.body.column.value)
        .orderBy('timestamp')
        .startAfter(req.body.column.timestamp)
        .limit(req.body.column.limit)
        .get();
      if (snapshot.empty) {
        return res.status(400).json("No matching documents.");
      }
      let alldocdata = [];
      snapshot.forEach(doc => {
        let singleObj = {};
        singleObj['id'] = doc.id;
        singleObj['data'] = doc.data();
        alldocdata.push(singleObj);
      });
      let singleObj = {};
      singleObj['next'] = snapshot.docs[snapshot.docs.length - 1].data().timestamp;
      singleObj['data'] = alldocdata;
      let docdata = [];
      docdata.push(singleObj);
      return res.status(200).json(docdata);
    }
  } else {
    if (req.body.column.timestamp == 0) {
      if ([req.body.table.name, req.body.column.limit].includes(undefined)) {
        return res.status(406).json("Missing Body Params");
      }
      const snapshot = await firestore.collection(req.body.table.name)
        .orderBy('timestamp')
        .limit(req.body.column.limit)
        .get();
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
      let singleObj = {};
      singleObj['next'] = snapshot.docs[snapshot.docs.length - 1].data().timestamp;
      singleObj['data'] = alldocdata;
      let docdata = [];
      docdata.push(singleObj);
      return res.status(200).json(docdata);
    } else {
      if ([req.body.table.name, req.body.column.timestamp, req.body.column.limit].includes(undefined)) {
        return res.status(406).json("Missing Body Params");
      }
      const snapshot = await firestore.collection(req.body.table.name)
        .orderBy('timestamp')
        .startAfter(req.body.column.timestamp)
        .limit(req.body.column.limit)
        .get();
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
      let singleObj = {};
      singleObj['next'] = snapshot.docs[snapshot.docs.length - 1].data().timestamp;
      singleObj['data'] = alldocdata;
      let docdata = [];
      docdata.push(singleObj);
      return res.status(200).json(docdata);
    }
  }
}
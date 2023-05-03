import { database } from '../../../firebase';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if (req.body.id) {
    if (req.body.type) {
      const ref = database.ref(req.body.id);
      if (req.body.type == 0) {
        return ref.on('value', (snapshot) => {
          return res.status(200).json(snapshot.val());
        }, (error) => {
          return res.status(500).json(error);
        });
      } else {
        return ref.on('value', (snapshot) => {
          let alldocdata = [];
          for (const [key, value] of Object.entries(snapshot.val())) {
            let singleObj = {};
            singleObj['id'] = key;
            singleObj['data'] = value;
            alldocdata.push(singleObj);
          }
          return res.status(200).json(alldocdata);
        }, (error) => {
          return res.status(500).json(error);
        });
      }
    } else {
      const ref = database.ref(req.body.id);
      return ref.once('value', (data) => {
        return res.status(200).json(data);
      }, (error) => {
        return res.status(500).json(error);
      });
    }
  }
  if ([req.body.id].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
}
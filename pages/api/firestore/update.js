import { firestore } from '../../../firebase';

export default function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	if (req.headers.authorization != process.env.TOKEN) {
		return res.status(401).json("Invalid Authentication Credentials");
	}
	if ([req.body.table.name, req.body.table.id, req.body.column].includes(undefined)) {
		return res.status(406).json("Missing Body Params");
	}
	return firestore.collection(req.body.table.name).doc(req.body.table.id).update(req.body.column)
		.then(function () {
			res.status(200).json("Document successfully updated!");
		})
		.catch(function (error) {
			res.status(500).json(error);
		});
}
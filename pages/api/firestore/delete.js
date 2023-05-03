import { firestore, firestoreFieldValue } from '../../../firebase';

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	if (req.headers.authorization != process.env.TOKEN) {
		return res.status(401).json("Invalid Authentication Credentials");
	}
	if (req.body.column.delete === "true") {
		if ([req.body.table.name, req.body.column.id, req.body.column.name].includes(undefined)) {
			return res.status(406).json("Missing Body Params");
		}
		const docTable = firestore.collection(req.body.table.name).doc(req.body.column.id);
		await docTable.update({
			[req.body.column.name]: firestoreFieldValue.delete()
		});
		return res.status(200).json("Field successfully deleted!");
	} else if (req.body.column.where === "true") {
		if ([req.body.table.name, req.body.column.name, req.body.column.operator, req.body.column.value].includes(undefined)) {
			return res.status(406).json("Missing Body Params");
		}
		const table = firestore.collection(req.body.table.name);
		const snapshot = await table.where(req.body.column.name, req.body.column.operator, req.body.column.value).get();
		if (snapshot.empty) {
			return res.status(404).json("No matching documents.");
		}
		snapshot.forEach(doc => {
			firestore.collection(req.body.table.name).doc(doc.id).delete();
		});
		return res.status(200).json("All documents successfully deleted!");
	} else {
		if ([req.body.table.name, req.body.column.id].includes(undefined)) {
			return res.status(406).json("Missing Body Params");
		}
		await firestore.collection(req.body.table.name).doc(req.body.column.id).delete();
		return res.status(200).json("Document successfully deleted!");
	}
}
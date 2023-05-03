import { firestore } from '../../../firebase';

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	if (req.headers.authorization != process.env.TOKEN) {
		return res.status(401).json("Invalid Authentication Credentials");
	}
	if (process.env.SERVER_KEY == undefined) {
		return res.status(406).json("Missing Server Key");
	}
	if ([req.body.table.name, req.body.column.id].includes(undefined)) {
		return res.status(406).json("Missing Body Params");
	}
	const crypto = require("crypto");
	const docTable = firestore.collection(req.body.table.name).doc(req.body.column.id);
	const doc = await docTable.get();
	if (!doc.exists) {
		return res.status(404).json("No such document!");
	} else {
		let encryptedData = doc.data();
		let cleardata = {};
		for (var key in encryptedData) {
			if (typeof encryptedData[key] !== "object") {

				const encryptedBuffer = Buffer.from(encryptedData[key], "base64");

				const hash = crypto.createHash("sha256");
				hash.update(process.env.SERVER_KEY);

				if (encryptedBuffer.length < 17) {
					return res.status(500).json("Provided ENCRYPTEDTEXT must decrypt to a non-empty string");
				}

				const iv = encryptedBuffer.slice(0, 16);
				const authTag = encryptedBuffer.slice(16, 32);
				const decipher = crypto.createDecipheriv("aes-256-gcm", hash.digest(), iv);
				decipher.setAuthTag(authTag);
				const cipherText = decipher.update(
					encryptedBuffer.slice(32),
					"base64",
					"utf-8"
				);
				const clearText = cipherText + decipher.final("utf-8");
				cleardata[key] = clearText;
			}
		}
		return res.status(200).json(cleardata);
	}
}
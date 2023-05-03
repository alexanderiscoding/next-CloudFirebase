import { firestore } from '../../../firebase';

export default function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	if (req.headers.authorization != process.env.TOKEN) {
		return res.status(401).json("Invalid Authentication Credentials");
	}
	if (process.env.SERVER_KEY == undefined) {
		return res.status(406).json("Missing Server Key");
	}
	if ([req.body.table.name, req.body.column].includes(undefined)) {
		return res.status(406).json("Missing Body Params");
	}
	const crypto = require("crypto");
	let cleardata = req.body.column;
	let encryptedData = {};
	for (var key in cleardata) {
		if (typeof cleardata[key] !== "object") {
			const hash = crypto.createHash("sha256");
			hash.update(process.env.SERVER_KEY);

			const iv = crypto.randomBytes(16);
			const cipher = crypto.createCipheriv("aes-256-gcm", hash.digest(), iv);

			const ciphertext = Buffer.concat([
				cipher.update(Buffer.from(cleardata[key]), "utf8"),
				cipher.final(),
			]);

			const authTag = cipher.getAuthTag();

			const encryptedText = Buffer.concat([iv, authTag, ciphertext]).toString(
				"base64"
			);
			encryptedData[key] = encryptedText;
		}
	}
	return firestore.collection(req.body.table.name).add(encryptedData)
		.then((doc) => {
			res.status(200).json(doc.id);
		})
		.catch((error) => {
			res.status(500).json(error);
		});
}
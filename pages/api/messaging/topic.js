import { messaging } from '../../../firebase';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.registrationTokens, req.body.topic, req.body.activate].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  if (req.body.activate) {
    return messaging.getMessaging().subscribeToTopic(req.body.registrationTokens, req.body.topic).then((response) => {
      res.status(200).json(response);
    }).catch((error) => {
      res.status(500).json(error);
    });
  } else {
    return messaging.getMessaging().unsubscribeFromTopic(req.body.registrationTokens, req.body.topic).then((response) => {
      res.status(200).json(response);
    }).catch((error) => {
      res.status(500).json(error);
    });
  }
}
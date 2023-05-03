import { messaging } from '../../../firebase';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers.authorization != process.env.TOKEN) {
    return res.status(401).json("Invalid Authentication Credentials");
  }
  if ([req.body.title, req.body.body].includes(undefined)) {
    return res.status(406).json("Missing Body Params");
  }
  let message = {};
  message['notification'] = {
    title: req.body.title,
    body: req.body.body
  };
  if (req.body.data) {
    message['data'] = req.body.data;
  }
  if (req.body.topic) {
    message['topic'] = req.body.topic;
  } else {
    message['token'] = req.body.registrationToken;
  }
  if (req.body.icon) {
    message['android'] = {
      notification: {
        icon: req.body.icon
      }
    };
  }
  if (req.body.icon && req.body.color) {
    message['android'] = {
      notification: {
        icon: req.body.icon,
        color: req.body.color
      }
    };
  }
  if (req.body.image) {
    message['android'] = {
      notification: {
        imageUrl: req.body.image
      }
    };
    message['apns'] = {
      payload: {
        aps: {
          'mutable-content': 1
        }
      },
      fcm_options: {
        image: req.body.image
      }
    };
  }
  return messaging.getMessaging().send(message).then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json(error);
  });
}
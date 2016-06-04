
var route = {};

route.get = function (req, res, next) {
  if (req.query['hub.verify_token'] === process.env.FB_VERIFYTOKEN) {
    res.send(req.query['hub.challenge']);
  }else{
    res.send('Error, wrong validation token');
  }
};


route.post = function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      req.sendTextMessage(sender, text);
    }
  }
  res.sendStatus(200);
};


module.exports = route;

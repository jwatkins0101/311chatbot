
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
  try{
    for (i = 0; i < messaging_events.length; i++) {
      event = req.body.entry[0].messaging[i];
      sender = event.sender.id;
      req.bot(sender, event);
    }
  }catch(ex){
    console.error(ex);
  }

  res.sendStatus(200);
};


module.exports = route;

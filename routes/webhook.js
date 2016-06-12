
var route = {};

route.get = function (req, res, next) {
  if (req.query['hub.verify_token'] === process.env.FB_VERIFYTOKEN) {
    res.send(req.query['hub.challenge']);
  }else{
    res.send('Error, wrong validation token');
  }
};


route.post = function (req, res) {

  try{
    messaging_events = req.body.entry[0].messaging;

    for (i = 0; i < messaging_events.length; i++) {
      event = req.body.entry[0].messaging[i];
      sender = event.sender.id;
      if(typeof event.postback != "undefined" || typeof event.message != "undefined"){
        req.bot(sender, event);
      }

    }
  }catch(err){
    console.error(err);
    console.error(err.stack)
  }

  res.json({msg: "okay"});
};


module.exports = route;

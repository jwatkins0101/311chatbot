var request = require("request");
var USPS = require('usps-webtools');
var Q = require("q");

var context = {};
var db = null;

function uspsValidation(address, callback) {
  var usps = new USPS({
    server: process.env.USPS_SERVER,
    userId: process.env.USERID,
    password:process.env.USPS_PASSWORD,
    ttl: 10000 //TTL in milliseconds for request
  });

  usps.verify({
    street1: address,
    street2: '',
    city: 'Louisville',
    state: 'KY',
    zip: '99999'
  }, callback);
}

function sendGenericMessage(sender, messageData) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: process.env.FB_ACCESS_TOKEN
    },
    method: 'POST',
    json: {
      recipient: {
        id:sender
      },
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendTextMessage(sender, text) {
  var messageData = {
    text:text
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: process.env.FB_ACCESS_TOKEN
    },
    method: 'POST',
    json: {
      recipient: {
        id:sender
      },
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

var problems = [{
  id: 0,
  description: "Structure not maintained",
  img: "structure_not_maintained_card_360.jpg",
},{
  id: 1,
  description: "Graffiti",
  img: "graffiti_card_480.jpg",
}, {
  id: 2,
  description: "Trash on private property",
  img: "trash_on_private_property_card_360.jpg",
}, {
  id: 3,
  description: "High weeds/Grass/trees",
  img: "structure_not_maintained_card_360.jpg",
}, {
  id: 4,
  description: "Abandoned Vehicle",
  img: "abandoned_vehicle_card_720.jpg",
}];

function buildWhatAboutMessage(address, problem){

  var elements = problems.reduce(function(elements, item){
    var notChosen = problem.reduce(function(notChosen, prob){
      return item.id == prob ? false : notChosen;
    }, true);

    if(notChosen){
      var payload = JSON.stringify({
        kind: "whatAbout",
        address: address,
        problem: problem,
        newProblem: item.id
      });

      elements.push({
        title: "Is this your problem?",
        image_url: "https://themayorlistens.com/images/" + item.img,
        // subtitle: "Please choose one...",
        buttons: [{
          type: "postback",
          title: item.description,
          payload: payload
        }]
      });
    }

    return elements;
  }, []);

  return {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: elements
      }
    }
  };
}

function buildAddAnotherMessage(address, problem){
  var buttons = [{
    id: 0,
    description: "No"
  }, {
    id: 1,
    description: "Yes"
  }].map(function(item){
    return {
      type: "postback",
      title: item.description,
      payload: JSON.stringify({
        kind: "addAnother",
        address: address,
        problem: problem,
        another: item.id
      })
    };
  });

  return {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Would you like to add another problem?",
          // "subtitle": "Please choose one...",
          "buttons": buttons,
        }]
      }
    }
  };
}

function logProblem(address, cases){
  // address = {address, zipcode}
  var report;
  return Q.fcall(function(){
    return model.Report.findOrCreate(address);
  })
    .then(function(item){
      report = item;

      var promises = cases.map(function(caesId){
        var name = problems.reduce(function(name, problem){
          return problem.id == caseId ? problem.description : name;
        }, "unknown");
        return model.CaseType.findOrCreate({name: name})
          .then(function(item){
            report.addCaseType(item);
          });
      });
    })
    .finally(function(){
      console.log("address:", address);
      console.log("problems:", problems);
    });
}

function handle(sender, event){
  // console.log("context", context[sender]);
  // console.log("event", event);

  switch(context[sender]){
    // 0. Ask for the address...
    default:
      sendTextMessage(sender, "Please enter an address.");
      context[sender] = "start";
      break;
    // 1. Ask for the problems or ask for the address again...
    case "start":
      uspsValidation(event.message.text, function(err, item){
        if(err){
          sendTextMessage(sender, "We couldn't find that address. Please enter the address again...");
          return null;
        }
        var address = {address: item.street1, zipcode: item.zip};
        var msg = buildWhatAboutMessage(address, []);
        sendGenericMessage(sender, msg);
        context[sender] = "addProblem";
      });
      break;
    // 2. Ask if they want to add another probelm.
    case "addProblem":
      var payload = JSON.parse(event.postback.payload);

      var problem = payload.problem.concat([payload.newProblem]);
      var msg = buildAddAnotherMessage(payload.address, problem);
      sendGenericMessage(sender, msg);
      context[sender] = "another";
      break;
    // 3. Log the data
    case "another":
      var payload = JSON.parse(event.postback.payload);

      if(payload.another){
        var msg = buildWhatAboutMessage(payload.address, payload.problem);
        sendGenericMessage(sender, msg);
        context[sender] = "addProblem";
      }else{
        logProblem(payload.address, payload.problem);
        sendTextMessage(sender, "Thanks for your report!");
        delete context[sender];
      }
      break;
  }
};

module.exports = function(db){
  model = db;
  return handle;
};

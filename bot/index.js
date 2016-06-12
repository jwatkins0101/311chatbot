var request = require("request");
//var Report = require('../models/report');
//var CaseType = require('../models/case_type');
var usps = require('usps-web-tools-node-sdk');

var context = {};


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

function uspsValidaation(address) {
  // tell it to use your username from the e-mail
  usps.configure({
    userID: '284TECHU4774',
    password:'504AD64RK104'
  });

  usps.addressInformation.verify(
      { address: address },

      function (error, response) {
        if (error) {
          // if there's a problem, the error object won't be null
          console.log(error);
        } else {
          // otherwise, you'll get a response object
          console.log(JSON.stringify(response));
        }
      }
  );
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

var problems0 = [{
  id: 0,
  description: "Structure not maintained",
},{
  id: 1,
  description: "Graffiti",
}, {
  id: 2,
  description: "Trash on private property"
}];

var problems1 = [{
  id: 3,
  description: "High weeds/Grass/trees"
}, {
  id: 4,
  description: "Abandoned Vehicle"
}, {
  id: 5,
  description: "Other"
}];

function buildWhatAboutMessage(address, problem){
  var buttons0 = problems0.map(function(item){
    return {
      type: "postback",
      title: item.description,
      payload: JSON.stringify({
        kind: "whatAbout",
        address: address,
        problem: problem,
        newProblem: item.id
      })
    };
  });

  var buttons1 = problems1.map(function(item){
    return {
      type: "postback",
      title: item.description,
      payload: JSON.stringify({
        kind: "whatAbout",
        address: address,
        problem: problem,
        newProblem: item.id
      })
    };
  });

  return {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "What problem are you having?",
          "subtitle": "Please choose one...",
          "buttons": buttons0,
        }, {
          "title": "What problem are you having?",
          "subtitle": "Please choose one...",
          "buttons": buttons1,
        }]
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

function logProblem(address, problems){
  console.log("address:", address);
  console.log("problems:", problems);
}

module.exports = function(sender, event){
  console.log("context", context[sender]);
  console.log("event", event);

  switch(context[sender]){
    // 0. Ask for the address...
    default:
      sendTextMessage(sender, "Please enter an address.");
      context[sender] = "start";
      break;
    // 1. Ask for the problems or ask for the address again...
    case "start":
      if (event.message && event.message.text) {
        var address = event.message.text;
        var msg = buildWhatAboutMessage(address, []);
        sendGenericMessage(sender, msg);
        context[sender] = "addProblem";
      }
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

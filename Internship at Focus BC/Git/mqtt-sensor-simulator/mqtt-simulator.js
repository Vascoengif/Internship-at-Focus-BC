"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var consoleUtils = __importStar(require("./console"));
var simulator_configuration_1 = require("./simulator-configuration");
var parameter_replacer_1 = require("./parameter-replacer");
var fs = require("fs");
var mqtt = require("mqtt");
var sensorName;
//--help to show instructions 
if (process.argv.length == 3) {
    process.argv.forEach(function (val, index) {
        switch (index) {
            case 2:
                if (val == "--help") {
                    console.log(consoleUtils.showInstructions());
                    process.exit(1);
                }
                else {
                    console.log("Type 'node mqqt-simulator --help' for more information\n");
                    process.exit(1);
                }
        }
    });
}
//read arguments from command line
if (process.argv.length != 7) {
    console.log("Invalid number of arguments. Expected 5 arguments");
    console.log("Type 'node mqqt-simulator --help' for more information\n");
    process.exit(1);
}
var configurationFilePath;
var numberOfMessages;
var interval;
var maximumStepDistance;
console.log("\n\nProcessing the input arguments ...\n");
console.log("-------------------------------------------------------------------------------------------------------------------\n");
// Process input parameters
process.argv.forEach(function (val, index) {
    switch (index) {
        case 2:
            {
                sensorName = val;
                break;
            }
        case 3:
            {
                var fileExists = fs.existsSync(val);
                try {
                    consoleUtils.checkFile(fileExists);
                    configurationFilePath = val;
                    console.log("| You choose to open the file : " + configurationFilePath + "\n");
                }
                catch (e) {
                    console.log(consoleUtils.showError(e));
                    console.log("Type 'node mqqt-simulator --help' for more information\n");
                    process.exit(1);
                }
                break;
            }
        case 4:
            {
                try {
                    numberOfMessages = consoleUtils.toInteger(val);
                    console.log("| Will send " + numberOfMessages + " messages.\n");
                }
                catch (e) {
                    console.log(consoleUtils.showError(e));
                    console.log("Type 'node mqqt-simulator --help' for more information\n");
                    process.exit(1);
                }
                break;
            }
        case 5:
            {
                try {
                    interval = consoleUtils.toInteger(val);
                    console.log("| Will send a message every " + interval + " seconds.\n");
                }
                catch (e) {
                    console.log(consoleUtils.showError(e));
                    console.log("Type 'node mqqt-simulator --help' for more information\n");
                    process.exit(1);
                }
                break;
            }
        case 6:
            try {
                maximumStepDistance = consoleUtils.toInteger(val);
                console.log("| Maximum Step Distance is " + maximumStepDistance + " meters.");
            }
            catch (e) {
                console.log(consoleUtils.showError(e));
                console.log("Type 'node mqqt-simulator --help' for more information\n");
                process.exit(1);
            }
    }
});
console.log("-------------------------------------------------------------------------------------------------------------------\n");
var simConfiguration = new simulator_configuration_1.SimulatorConfiguration(configurationFilePath);
//print test
//console.log('Simulator configuration: ' + JSON.stringify(simConfiguration.configuration))
var messageTemplate = JSON.stringify(simConfiguration.getSensorMessage());
var mqttBrokerTemplate = simConfiguration.getMqttBroker();
var parameterReplacer = new parameter_replacer_1.ParameterReplacer();
var options = {
    username: mqttBrokerTemplate.username,
    password: mqttBrokerTemplate.password,
    connectTimeout: 5000
};
var host = mqttBrokerTemplate.url + ":" + mqttBrokerTemplate.port;
var timeInterval = interval * 1000;
var messageIndex = 0;
var timerId;
//connect to mqtt
var client = mqtt.connect(host, options);
client.on('offline', function () {
    console.log("Connection Failed! Couldn't connect to mqtt broker. Check your url and/or port in configuration file.");
    process.exit(1);
    //client.end()
});
client.on('error', function () {
    console.log("Connection Failed! Check the mqtt broker template in configuration file or your internet connection.");
    process.exit(1);
});
client.on('connect', function () {
    console.log("Connected\n\n");
    timerId = setInterval(function () { return sendMessage(numberOfMessages); }, timeInterval);
});
//generate messages and set timeout
function sendMessage(numberOfMessages) {
    var tokenizedTemplate = messageTemplate.split('$$');
    for (var i in tokenizedTemplate) {
        tokenizedTemplate[i] = parameterReplacer.replaceAll(sensorName, tokenizedTemplate[i], messageIndex, maximumStepDistance);
    }
    //print test
    //console.log(tokenizedTemplate.join(" ") + "\n\n")
    var message = tokenizedTemplate.join(" ");
    var json = JSON.parse(tokenizedTemplate.join(" "));
    client.publish(mqttBrokerTemplate.topic, message);
    console.log(json);
    console.log("------------------------------------------------- message " + (messageIndex + 1) + " of " + numberOfMessages + " ---------------------------------------------------------------");
    messageIndex++;
    if (messageIndex >= numberOfMessages) {
        clearInterval(timerId);
        client.end();
        process.exit(1);
    }
}

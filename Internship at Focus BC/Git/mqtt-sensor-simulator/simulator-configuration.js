"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorConfiguration = void 0;
var fs = require('fs');
var SimulatorConfiguration = /** @class */ (function () {
    function SimulatorConfiguration(configFilePath) {
        this.readConfigFile(configFilePath);
    }
    SimulatorConfiguration.prototype.readConfigFile = function (configFilePath) {
        try {
            var configFile = fs.readFileSync(configFilePath).toString();
            this.configuration = JSON.parse(configFile);
        }
        catch (e) {
            throw new Error('The configuration file does not exist or is in invalid format. Please specify the path ' +
                ' a valid configuration file.');
        }
    };
    SimulatorConfiguration.prototype.getSensorMessage = function () {
        if (!this.configuration.sensorMessage)
            throw new Error('Sensor message template not found or invalid. Please confirm that ' +
                'a valid sensor message template is provided in the sensorMessage attribute of ' +
                'the configuration file.');
        return this.configuration.sensorMessage;
    };
    SimulatorConfiguration.prototype.getMqttBroker = function () {
        if (!this.configuration.mqttBroker)
            throw new Error('Mqtt broker template not found or invalid. Please confirm that ' +
                'a valid mqtt broker template is provided in the mqttBroker attribute of ' +
                'the configuration file.');
        return this.configuration.mqttBroker;
    };
    return SimulatorConfiguration;
}());
exports.SimulatorConfiguration = SimulatorConfiguration;

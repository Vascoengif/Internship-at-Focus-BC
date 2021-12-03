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
exports.ParameterReplacer = void 0;
var bounding_box_1 = require("./bounding-box");
var point_1 = require("./point");
var consoleUtils = __importStar(require("./console"));
var ParameterReplacer = /** @class */ (function () {
    function ParameterReplacer() {
    }
    ParameterReplacer.prototype.replaceAll = function (sensorName, parameterValue, messageIndex, maximumStepDistance) {
        //print test
        //console.log("----" + parameterValue.substring(0,2) + "----" + "\n\n")
        var parameter = parameterValue.substring(0, 2);
        switch (parameter) {
            case "s ":
                return this.replaceString(parameterValue);
            case "m ":
                return this.replaceArrayOfNumbers(parameterValue);
            case "b ":
                return this.replaceBoolean();
            case "n ":
                return this.replaceNumber(parameterValue);
            case "c ":
                return this.replaceCoordinates(parameterValue, messageIndex, maximumStepDistance);
                ;
            case "d ":
                return this.replaceDistance(messageIndex);
            case "i ":
                return this.replaceSensorName(sensorName);
            default:
                return this.takeOffQuotationMarks(parameterValue);
        }
    };
    ParameterReplacer.prototype.replaceSensorName = function (sensorName) {
        return "\"" + sensorName + "\"";
    };
    ParameterReplacer.prototype.replaceString = function (parameterValue) {
        var sizeArray;
        var index;
        var tokenizedParameterValue = parameterValue.substring(3, parameterValue.length - 2).split(",");
        sizeArray = tokenizedParameterValue.length;
        index = Math.floor(Math.random() * (sizeArray));
        return "\"" + tokenizedParameterValue[index] + "\"";
    };
    ParameterReplacer.prototype.replaceArrayOfNumbers = function (parameterValue) {
        var sizeArray;
        var index;
        var tokenizedParameterValue = parameterValue.substring(3, parameterValue.length - 2).split(",");
        sizeArray = tokenizedParameterValue.length;
        index = Math.floor(Math.random() * (sizeArray));
        return parseInt(tokenizedParameterValue[index], 10);
    };
    ParameterReplacer.prototype.replaceNumber = function (parameterValue) {
        var tokenizedParameterValue = parameterValue.substring(3, parameterValue.length - 2).split(",");
        var max = parseInt(tokenizedParameterValue[1], 10);
        var min = parseInt(tokenizedParameterValue[0], 10);
        var result = Math.floor(Math.random() * (max - min + 1) + min);
        return result;
    };
    ParameterReplacer.prototype.replaceBoolean = function () {
        var randomNumber;
        randomNumber = Math.round(Math.floor(Math.random() * 2));
        if (randomNumber == 0) {
            return false;
        }
        else {
            return true;
        }
    };
    ParameterReplacer.prototype.replaceCoordinates = function (parameterValue, messageIndex, maximumStepDistance) {
        this.previousCoordinates = this.currentCoordinates;
        if (messageIndex != 0) {
            //print test
            //console.log(this.boundingbox)
            try {
                this.currentCoordinates = this.generateRandomPoint(this.boundingbox, this.previousCoordinates.getPoint(), maximumStepDistance);
            }
            catch (e) {
                console.log(consoleUtils.showError(e));
                process.exit(1);
            }
        }
        else {
            var tokenizedParameterValue = parameterValue.substring(3, parameterValue.length - 2).split(",");
            this.minLatitude = parseFloat(tokenizedParameterValue[0]);
            this.maxLatitude = parseFloat(tokenizedParameterValue[1]);
            this.minLongitude = parseFloat(tokenizedParameterValue[2]);
            this.maxLongitude = parseFloat(tokenizedParameterValue[3]);
            var bb = new bounding_box_1.BoundingBox(this.maxLatitude, this.minLatitude, this.maxLongitude, this.minLongitude);
            this.boundingbox = bb;
            this.currentCoordinates = this.generateRandomPoint(bb);
        }
        return new Array(this.currentCoordinates.getPoint());
    };
    ParameterReplacer.prototype.takeOffQuotationMarks = function (parameterValue) {
        if (parameterValue.substring(0, 1) == "\"" && parameterValue.substring(1, 2) != "}") {
            var ini = parameterValue.substring(0, 1).replace("\"", ", ");
            parameterValue = ini.concat(parameterValue.substr(2));
        }
        if (parameterValue.substring(0, 1) == "\"" && parameterValue.substring(1, 2) == "}") {
            var ini = parameterValue.substring(0, 1).replace("\"", " ");
            parameterValue = ini.concat(parameterValue.substr(1));
        }
        if (parameterValue.substr(parameterValue.length - 1) == "\"") {
            var end = parameterValue.substr(parameterValue.length - 1).replace("\"", " ");
            parameterValue = parameterValue.substring(0, parameterValue.length - 1).concat(end);
        }
        if (parameterValue.substr(parameterValue.length - 1) == "[") {
            var end = parameterValue.substr(parameterValue.length - 2).replace("\"", " ");
            parameterValue = parameterValue.substring(0, parameterValue.length - 2).concat(end);
        }
        if (parameterValue.substring(0, 1) == "]") {
            var ini = parameterValue.substring(0, 2).replace("\"", " ");
            parameterValue = ini.concat(parameterValue.substr(2));
        }
        return parameterValue;
    };
    //Coordinates functions
    ParameterReplacer.prototype.generateRandomAngle = function () {
        var angle = Math.floor(Math.random() * (360));
        return angle;
    };
    ParameterReplacer.prototype.generateRandomDistanceToMove = function (stepDistance) {
        var distance = Math.random() * stepDistance;
        return distance;
    };
    ParameterReplacer.prototype.isInsideBoundingBox = function (bb, latitude, longitude) {
        if (latitude < bb.minLatitude || latitude > bb.maxLatitude || longitude < bb.minLongitude || longitude > bb.maxLongitude) {
            return false;
        }
        return true;
    };
    ParameterReplacer.prototype.metersToDegrees = function (meters) {
        return (meters * 0.001) / 111;
    };
    ParameterReplacer.prototype.generateRandomPoint = function (bb, previousCoordinates, stepDistance) {
        var randomLatitude, randomLongitude;
        //Validate all possible missing (null) input parameters
        if (previousCoordinates == null && stepDistance == null) {
            randomLatitude = bb.minLatitude + Math.random() * (bb.maxLatitude - bb.minLatitude);
            randomLongitude = bb.minLongitude + Math.random() * (bb.maxLongitude - bb.minLongitude);
        }
        else if (previousCoordinates == null || stepDistance == null) {
            throw new Error('Missing input parameters.');
        }
        else {
            var isInsideBoundingBox = false;
            var angle = this.generateRandomAngle();
            var temporaryStepDistance = stepDistance;
            // While generated point is not inside BB
            while (isInsideBoundingBox == false) {
                // Generate random new point with the same angle but change the distance
                var distance = this.generateRandomDistanceToMove(temporaryStepDistance);
                var latitudeMeters = (Math.sin(angle) * distance); //this is in meters
                // Convert distance in meters from config to lat/lng degrees before calculations
                randomLatitude = this.metersToDegrees(latitudeMeters) + previousCoordinates[0];
                var longitudeMeters = (Math.cos(angle) * distance); //this is in meters
                // Convert distance in meters from config to lat/lng degrees before calculations
                randomLongitude = this.metersToDegrees(longitudeMeters) + previousCoordinates[1];
                isInsideBoundingBox = this.isInsideBoundingBox(bb, randomLatitude, randomLongitude);
                console.log("[parameter-replacer.generateRandomPoint] New random point generated " + (isInsideBoundingBox == true ? "inside" : "outside") + " the bounding box (distance: " + distance + ")");
                this.distance = distance;
                temporaryStepDistance = distance;
            }
        }
        console.log("[parameter-replacer.generateRandomPoint] Point returned: [" + randomLatitude + "," + randomLongitude + "]\n");
        var point = new point_1.Point(randomLatitude, randomLongitude);
        return point;
    };
    ParameterReplacer.prototype.replaceDistance = function (messageIndex) {
        if (messageIndex != 0)
            return this.distance;
        else
            return 0;
    };
    return ParameterReplacer;
}());
exports.ParameterReplacer = ParameterReplacer;

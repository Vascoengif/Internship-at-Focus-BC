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
exports.BoundingBox = void 0;
var consoleUtils = __importStar(require("./console"));
var BoundingBox = /** @class */ (function () {
    function BoundingBox(maxLat, minLat, maxLong, minLong) {
        this.maxLatitude = maxLat;
        this.minLatitude = minLat;
        this.maxLongitude = maxLong;
        this.minLongitude = minLong;
        try {
            if (isNaN(maxLat) || isNaN(minLat) || isNaN(maxLong) || isNaN(minLat)) {
                throw new Error('Something went wrong with the bounding box values. Please check the values in your configuration.');
            }
            else if (minLat >= maxLat) {
                throw new Error('The minimum latitude must be smaller than maximum latitude');
            }
            else if (minLong >= maxLong) {
                throw new Error('The minimum longitude must be smaller than maximun longitude');
            }
        }
        catch (e) {
            console.log(consoleUtils.showError(e));
            process.exit(1);
        }
    }
    return BoundingBox;
}());
exports.BoundingBox = BoundingBox;

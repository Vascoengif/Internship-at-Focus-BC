"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var Point = /** @class */ (function () {
    function Point(lat, long) {
        this.latitude = lat;
        this.longitude = long;
        this.point = [lat, long];
    }
    Point.prototype.getPoint = function () {
        return this.point;
    };
    return Point;
}());
exports.Point = Point;

"use strict";
var Kalkulator = (function () {
    function Kalkulator() {
        this.rentefot = 0.07;
    }
    Kalkulator.prototype.beregn = function (belop, tid) {
        var y = (this.rentefot * belop) /
            (1 - Math.pow((1 + this.rentefot), -tid));
        return parseFloat((y / 12).toFixed(2));
    };
    return Kalkulator;
}());
exports.Kalkulator = Kalkulator;
//# sourceMappingURL=kalkulator.js.map
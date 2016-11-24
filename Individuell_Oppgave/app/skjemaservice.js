"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
require("rxjs/add/operator/toPromise");
require('rxjs/add/operator/catch');
var Observable_1 = require('rxjs/Observable');
var SkjemaService = (function () {
    function SkjemaService(_http) {
        this._http = _http;
        this.url = "api/bruker";
        this.headers = new http_1.Headers({ "Content-Type": "application/json" });
        this.options = new http_1.RequestOptions({ headers: this.headers });
    }
    SkjemaService.prototype.feil = function (error) {
        return Promise.reject(error.message || error);
    };
    // Lagrer en søknad. -- (fortsetter å feile)
    SkjemaService.prototype.lagreSoknad = function (soknad) {
        alert("LAgreservice");
        var body = JSON.stringify(soknad);
        return this._http.post("api/Bruker", body, this.options)
            .map(function (returData) { return returData.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error.json().error || "Feil med server."); });
    };
    // Endrer søknad -- fungerer
    SkjemaService.prototype.endreSoknad = function (endretSoknad) {
        var body = JSON.stringify(endretSoknad);
        return this._http.put("api/Bruker", body, this.options)
            .map(function (returData) { return returData.toString(); });
    };
    // Henter en søknad -- fungerer
    SkjemaService.prototype.hentSoknad = function (id) {
        return this._http.get("api/Bruker/" + id)
            .map(function (returdata) { return returdata.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error.json().error || "Feil med server."); });
    };
    // fungerer, men må skrives om
    SkjemaService.prototype.slettSoknad = function (id) {
        return this._http.delete("api/Bruker/" + id)
            .map(function (returdata) { return returdata.toString(); });
    };
    SkjemaService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SkjemaService);
    return SkjemaService;
}());
exports.SkjemaService = SkjemaService;
//# sourceMappingURL=skjemaservice.js.map
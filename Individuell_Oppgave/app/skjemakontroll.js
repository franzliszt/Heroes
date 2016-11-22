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
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
require("rxjs/add/operator/map");
var soknad_1 = require("./soknad");
var skjemaservice_1 = require("./skjemaservice");
var SkjemaKontroll = (function () {
    function SkjemaKontroll(fb, backend) {
        this.fb = fb;
        this.backend = backend;
        this.skjema = fb.group({
            id: ["", forms_1.Validators.pattern("[0-9]{1,1000}")],
            personnummer: ["", forms_1.Validators.pattern("[0-9]{11}")],
            mobiltelefon: ["", forms_1.Validators.pattern("[0-9]{8}")],
            epost: ["", forms_1.Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}")],
            belop: ["", forms_1.Validators.pattern("[0-9]{4,7}")],
            nedbetalingstid: ["", forms_1.Validators.pattern("[0-9]{1,2}")]
        });
    }
    SkjemaKontroll.prototype.ngOnInit = function () {
        this.laster = true;
        this.visKalkulator = false;
        this.skjemaStatus = "registrer";
        this.visSkjema = true;
    };
    // Ikke ferdig
    SkjemaKontroll.prototype.hentAlle = function () {
        var _this = this;
        this.backend.hentAlle()
            .subscribe(function (retur) { return _this.alleSoknader = retur; }, function (error) { return alert("FEIL " + error); });
    };
    SkjemaKontroll.prototype.vedSubmit = function () {
        if (this.skjemaStatus == "registrer") {
            this.lagreSoknad();
        }
        else if (this.skjemaStatus == "endre") {
            alert("Endre kunde");
        }
        else {
            alert("FEIL");
        }
    };
    // lagrer en søknad og virker -- ikke ferdig
    SkjemaKontroll.prototype.lagreSoknad = function () {
        var soknad = this.opprettSoknad();
        this.backend.lagreSoknad(soknad).subscribe(function (retur) { return alert(retur.toString()); }, function (error) { return alert(error); });
    };
    // oppretter en søknad og virker - ikke ferdig
    SkjemaKontroll.prototype.opprettSoknad = function () {
        var soknad = new soknad_1.Soknad();
        soknad.personnummer = this.skjema.value.personnummer,
            soknad.mobiltelefon = this.skjema.value.mobiltelefon;
        soknad.epost = this.skjema.value.epost;
        soknad.belop = this.skjema.value.belop;
        soknad.nedbetalingstid = this.skjema.value.nedbetalingstid;
        return soknad;
    };
    // fra kalkulatoren
    SkjemaKontroll.prototype.tilbakeTilRegisreringsskjema = function () {
        this.visSkjema = true;
        this.finnMinSoknad = false;
        this.visKalkulator = false;
    };
    // ikke ferdig
    SkjemaKontroll.prototype.nullstill = function () {
        this.skjema.patchValue({ personnummer: "" });
        this.skjema.patchValue({ mobiltelefon: "" });
        this.skjema.patchValue({ epost: "" });
        this.skjema.patchValue({ belop: "" });
        this.skjema.patchValue({ nedbetalingstid: "" });
    };
    // ikke ferdig
    SkjemaKontroll.prototype.visMinLaneSoknad = function () {
        this.visKalkulator = false;
        this.visSkjema = false;
        this.finnMinSoknad = true;
    };
    SkjemaKontroll.prototype.tilKalulator = function () {
        // viser en kalkulator
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = true;
    };
    // virker ikke helt
    SkjemaKontroll.prototype.hentMinSoknad = function (id) {
        var _this = this;
        alert("Inne i hent min søknad " + id);
        this.backend.hentSoknad(id).subscribe(function (retur) {
            alert("Inne i henting og fant pnr som er " + retur.personnummer);
            _this.skjema.patchValue({ id: retur.id });
            _this.skjema.patchValue({ personnummer: retur.personnummer });
            _this.skjema.patchValue({ mobiltelefon: retur.mobiltelefon });
            _this.skjema.patchValue({ epost: retur.epost });
            _this.skjema.patchValue({ belop: retur.belop });
            _this.skjema.patchValue({ nedbetalingstid: retur.nedbetalingstid });
            _this.finnMinSoknad = false;
            _this.skjemaStatus = "registrer";
            _this.visSkjema = true;
        }, function (error) { return alert(error); });
    };
    SkjemaKontroll.prototype.beregn = function () {
        this.skjema.patchValue({ avdrag: "2000" });
    };
    SkjemaKontroll.prototype.endreSoknad = function () {
        // hente kunden fra databasen og fylle ut skjemaet
        alert("endre søknad");
        this.skjemaStatus = "endre";
        this.visSkjema = true;
    };
    SkjemaKontroll = __decorate([
        core_1.Component({
            selector: "registrering",
            templateUrl: "./app/Registrering.html",
            providers: [skjemaservice_1.SkjemaService]
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, skjemaservice_1.SkjemaService])
    ], SkjemaKontroll);
    return SkjemaKontroll;
}());
exports.SkjemaKontroll = SkjemaKontroll;
//# sourceMappingURL=skjemakontroll.js.map
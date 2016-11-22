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
var kalkulator_1 = require("./kalkulator");
var skjemaservice_1 = require("./skjemaservice");
var SkjemaKontroll = (function () {
    function SkjemaKontroll(fb, service) {
        this.fb = fb;
        this.service = service;
        this.skjema = fb.group({
            id: ["", forms_1.Validators.pattern("[0-9]{1,1000}")],
            personnummer: ["", forms_1.Validators.pattern("[0-9]{11}")],
            mobiltelefon: ["", forms_1.Validators.pattern("[0-9]{8}")],
            // ikke helt bra -- epost
            epost: ["", forms_1.Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}")],
            belop: ["", forms_1.Validators.pattern("[0-9]{4,7}")],
            nedbetalingstid: ["", forms_1.Validators.pattern("[0-9]{1,2}")],
            avdrag: [""]
        });
    }
    SkjemaKontroll.prototype.ngOnInit = function () {
        this.laster = true;
        this.skjemaStatus = "registrer";
        this.visSkjema = false;
        this.velkommen = true;
    };
    SkjemaKontroll.prototype.vedSubmit = function () {
        if (this.skjemaStatus == "registrer") {
            this.lagreSoknad();
        }
        else if (this.skjemaStatus == "endre") {
            this.endreMinSoknad();
        }
        else {
            // vis feilvindu
            alert("FEIL");
        }
    };
    // ferdig
    SkjemaKontroll.prototype.nullstill = function () {
        this.skjema.patchValue({ id: "" });
        this.skjema.patchValue({ personnummer: "" });
        this.skjema.patchValue({ mobiltelefon: "" });
        this.skjema.patchValue({ epost: "" });
        this.skjema.patchValue({ belop: "" });
        this.skjema.patchValue({ nedbetalingstid: "" });
        this.skjema.patchValue({ avdrag: "" });
    };
    // ikke ferdig
    SkjemaKontroll.prototype.visMinLaneSoknad = function () {
        this.nullstill();
        this.skjema.patchValue({ id: "" });
        this.visKalkulator = false;
        this.visSkjema = false;
        this.skjemaStatus = "endre";
        this.finnMinSoknad = true;
    };
    // virker ikke -- kalkulator må fikses
    SkjemaKontroll.prototype.beregn = function () {
        // hent data og sjekk om de er gyldige feks ikke 00
        var k = new kalkulator_1.Kalkulator();
        this.skjema.patchValue({ avdrag: k.beregn(1000000, 30) });
    };
    // ikke ferdig
    SkjemaKontroll.prototype.tilKalulator = function () {
        // viser en kalkulator
        this.nullstill();
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = true;
    };
    /* *****Metoder som kaller på tjenesten mot api***** */
    // lagrer en søknad og virker -- ikke ferdig
    SkjemaKontroll.prototype.lagreSoknad = function () {
        var _this = this;
        this.laster = true;
        var soknad = this.opprettSoknad();
        if (soknad.personnummer == "" || soknad.mobiltelefon == "" || soknad.epost == "" ||
            soknad.belop == null || soknad.nedbetalingstid == null) {
            alert("Ingen tomme felter");
            return;
        }
        this.service.lagreSoknad(soknad).subscribe(function (retur) { return alert(retur + "XXXXXXXXXXX ===> OK"); }, function (error) {
            _this.feil("Klarte ikke å lagre.");
        });
        this.laster = false;
    };
    // Hjelpemetode for å hente data fra skjemaet.
    SkjemaKontroll.prototype.opprettSoknad = function () {
        var soknad = new soknad_1.Soknad();
        soknad.id = this.skjema.value.id;
        soknad.personnummer = this.skjema.value.personnummer,
            soknad.mobiltelefon = this.skjema.value.mobiltelefon;
        soknad.epost = this.skjema.value.epost;
        soknad.belop = this.skjema.value.belop;
        soknad.nedbetalingstid = this.skjema.value.nedbetalingstid;
        return soknad;
    };
    // virker 
    SkjemaKontroll.prototype.hentMinSoknad = function (id) {
        var _this = this;
        if (id == "") {
            alert("Feltet er tomt");
        }
        else {
            this.service.hentSoknad(id).subscribe(function (retur) {
                _this.skjema.patchValue({ id: retur.id });
                _this.skjema.patchValue({ personnummer: retur.personnummer });
                _this.skjema.patchValue({ mobiltelefon: retur.mobiltelefon });
                _this.skjema.patchValue({ epost: retur.epost });
                _this.skjema.patchValue({ belop: retur.belop });
                _this.skjema.patchValue({ nedbetalingstid: retur.nedbetalingstid });
                _this.finnMinSoknad = false;
                _this.skjemaStatus = "endre";
                _this.visSkjema = true;
            }, function (error) {
                _this.feil("Klarte ikke å hente søknad med søknadsnummer: " + id);
            });
        }
    };
    // Endrer søknad
    SkjemaKontroll.prototype.endreMinSoknad = function () {
        var _this = this;
        this.service.endreSoknad(this.opprettSoknad())
            .subscribe(function (retur) {
            alert("Endring ok");
            _this.skjemaStatus = "registrer";
            _this.nullstill();
        }, function (error) {
            _this.feil("Endring av søknad mislyktes.");
        });
    };
    SkjemaKontroll.prototype.slettSoknad = function (id) {
        var _this = this;
        this.service.slettSoknad(id)
            .subscribe(function (retur) {
            alert("Sletting ok");
            _this.skjemaStatus = "registrer";
            _this.nullstill();
        }, function (error) {
            _this.feil("Klarte ikke å slette søknad med søknadsnummer " + id);
        });
    };
    // til skjemaet
    SkjemaKontroll.prototype.tilbake = function () {
        this.velkommen = false;
        this.nullstill();
        this.visKalkulator = false;
        this.finnMinSoknad = false;
        this.feilmelding = false;
        this.skjemaStatus = "registrer";
        this.visSkjema = true;
    };
    // håndtering av feil-retur
    SkjemaKontroll.prototype.feil = function (inputFeil) {
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = false;
        this.feilmelding = true;
        this.melding = inputFeil;
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
//# sourceMappingURL=skjemakontroll.component.js.map
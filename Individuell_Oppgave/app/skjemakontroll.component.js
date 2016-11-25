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
    // private service er den som brukes ved kall som går mot api/Bruker.
    function SkjemaKontroll(fb, service) {
        this.fb = fb;
        this.service = service;
        this.skjema = fb.group({
            id: ["", forms_1.Validators.pattern("[0-9]{1,10}")],
            personnummer: ["", forms_1.Validators.pattern("[0-9]{11}")],
            mobiltelefon: ["", forms_1.Validators.pattern("[0-9]{8}")],
            // ikke helt bra -- epost
            epost: ["", forms_1.Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}")],
            belop: ["", forms_1.Validators.pattern("[0-9]{4,7}")],
            nedbetalingstid: ["", forms_1.Validators.pattern("[0-9]{1,2}")],
            avdrag: [""]
        });
    }
    SkjemaKontroll.prototype.hentMineSoknader = function (pnr) {
        var _this = this;
        this.service.hentMineSoknader(pnr).subscribe(function (soknader) {
            if (soknader) {
                _this.oppdaterSoknadsliste(soknader);
                _this.visSkjema = false;
                _this.finnMinSoknad = false;
                _this.visListe = true;
            }
            ;
        }, function (error) { return _this.statusmelding("Klarte ikke hente din informasjon."); });
    };
    SkjemaKontroll.prototype.oppdaterSoknadsliste = function (soknader) {
        alert("Oppdaterer søknader");
        this.alleSoknader = [];
        for (var _i = 0, soknader_1 = soknader; _i < soknader_1.length; _i++) {
            var soknad = soknader_1[_i];
            this.alleSoknader.push(soknad);
            this.laster = false;
        }
    };
    // Initialiserer nødvendighet.
    SkjemaKontroll.prototype.ngOnInit = function () {
        this.belop = 150000;
        this.tid = 5;
        this.nullstill();
        this.kalkulerAvdrag();
        this.laster = true;
        this.skjemaStatus = "registrer";
        this.visSkjema = false;
        //this.velkommen = true;
        this.visKalkulator = true;
    };
    SkjemaKontroll.prototype.vedSubmit = function () {
        if (this.skjemaStatus == "registrer") {
            this.lagreSoknad();
        }
        else {
            this.statusmelding("Opps. Her gikk det galt. Vi holder på å reparere problemet.\n"
                + "Vennligst prøv igjen senere.");
        }
    };
    // Nullstiller skjemaet.
    SkjemaKontroll.prototype.nullstill = function () {
        this.skjema.patchValue({ id: "" });
        this.skjema.patchValue({ personnummer: "" });
        this.skjema.patchValue({ mobiltelefon: "" });
        this.skjema.patchValue({ epost: "" });
        this.skjema.patchValue({ belop: "" });
        this.skjema.patchValue({ nedbetalingstid: "" });
        this.skjema.patchValue({ avdrag: "" });
        this.settStartverdier();
    };
    // Startverdier på slidere.
    SkjemaKontroll.prototype.settStartverdier = function () {
        this.belop = 150000;
        this.tid = 5;
    };
    // ikke ferdig
    SkjemaKontroll.prototype.visMinLaneSoknad = function () {
        this.skjema.patchValue({ personnummer: "" });
        this.visKalkulator = false;
        this.visSkjema = false;
        this.visListe = false;
        //this.skjemaStatus = "endre";
        this.finnMinSoknad = true;
    };
    // Viser søknadsskjemaet.
    SkjemaKontroll.prototype.tilSkjema = function () {
        (!this.visListe) ? this.skjemaStatus == "endre" : this.skjemaStatus = "registrer";
        this.finnMinSoknad = false;
        this.visSkjema = true;
        this.visKalkulator = false;
    };
    // kalkulerer avdrag pr mnd
    SkjemaKontroll.prototype.kalkulerAvdrag = function () {
        var y = (0.07 * this.belop) /
            (1 - Math.pow((1 + 0.079), -this.tid));
        this.avdrag = (parseFloat((y / 12).toFixed(2)));
    };
    /* *****Metoder som kaller på tjenesten mot api***** */
    // lagrer en søknad og virket -- ikke ferdig
    SkjemaKontroll.prototype.lagreSoknad = function () {
        var _this = this;
        alert("Inn");
        this.laster = true;
        var soknad = this.opprettSoknad();
        if (soknad.personnummer == "" || soknad.mobiltelefon == "" || soknad.epost == "" ||
            soknad.belop == null || soknad.nedbetalingstid == null) {
            this.skjema.patchValue({ personnummer: " " });
            return;
        }
        this.service.lagreSoknad(soknad).subscribe(function (retur) { return _this.ok("Søknad lagret med søknadsnummer " + retur.id + ".\n" +
            "Vennligst husk dette for fremtidig endring/visning av søknaden."); }, function (error) {
            _this.statusmelding("Klarte ikke å lagre.");
        });
        this.laster = false;
    };
    // Hjelpemetode for å hente data fra skjemaet og oppretter en søknad.
    SkjemaKontroll.prototype.opprettSoknad = function () {
        var soknad = new soknad_1.Soknad();
        soknad.personnummer = this.skjema.value.personnummer;
        soknad.mobiltelefon = this.skjema.value.mobiltelefon;
        soknad.epost = this.skjema.value.epost;
        soknad.belop = this.belop;
        soknad.nedbetalingstid = this.tid;
        soknad.avdragPrMnd = this.avdrag;
        return soknad;
    };
    // Henter en spesifikk søknad ved bruk av søknadsnummer. 
    SkjemaKontroll.prototype.hentMinSoknad = function (soknad) {
        this.skjema.patchValue({ id: soknad.id });
        this.skjema.patchValue({ personnummer: soknad.personnummer });
        this.skjema.patchValue({ mobiltelefon: soknad.mobiltelefon });
        this.skjema.patchValue({ epost: soknad.epost });
        this.skjema.patchValue({ belop: soknad.belop });
        this.belop = soknad.belop;
        this.tid = soknad.nedbetalingstid;
        this.avdrag = soknad.avdragPrMnd;
        this.finnMinSoknad = false;
        this.skjemaStatus = "endre";
        this.visListe = false;
        this.visSkjema = true;
    };
    // Endrer søknad
    SkjemaKontroll.prototype.endreMinSoknad = function () {
        var _this = this;
        var soknad = this.opprettSoknad();
        soknad.id = this.skjema.value.id;
        this.service.endreSoknad(soknad)
            .subscribe(function (retur) {
            _this.ok("Søknad med søknadsnummer " + soknad.id + " er endret.");
            _this.hentMineSoknader(soknad.personnummer);
            //this.skjemaStatus = "registrer";
            //this.nullstill();
        }, function (error) {
            _this.statusmelding("Endring av søknad mislyktes.");
        });
    };
    // Fungerer.
    SkjemaKontroll.prototype.slettSoknad = function (id) {
        var _this = this;
        this.service.slettSoknad(id)
            .subscribe(function (retur) {
            if (retur) {
                _this.oppdaterSoknadsliste(retur);
                _this.visSkjema = false;
                _this.finnMinSoknad = false;
                _this.visListe = true;
            }
            ;
        }, function (error) {
            _this.statusmelding("Klarte ikke å slette søknad med søknadsnummer " + id);
        });
    };
    // Sender til lånekalkulatoren.
    SkjemaKontroll.prototype.tilbake = function () {
        (this.visListe) ? !this.visKalkulator : this.visKalkulator = true;
        this.finnMinSoknad = false;
        this.status = false;
        //this.visSkjema = false;
        this.okBoks = false;
    };
    // Viser en meldingsboks med informasjon når en operasjon går ikke bra.
    SkjemaKontroll.prototype.statusmelding = function (inputFeil) {
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = false;
        this.status = true;
        this.melding = inputFeil;
    };
    // Viser en meldingsboks med informasjon når en operasjon går bra.
    SkjemaKontroll.prototype.ok = function (okMelding) {
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = false;
        this.visListe = false;
        this.okBoks = true;
        this.melding = okMelding;
        this.nullstill();
    };
    // Avbryte endringer av en hentet søknad og nullstiller skjema.
    // Returnerer til lånekalkulatoren.
    SkjemaKontroll.prototype.avbryt = function () {
        this.skjemaStatus = "registrer";
        this.nullstill(); // må endres
        this.visSkjema = false;
        this.visListe = false;
        this.visKalkulator = true;
    };
    SkjemaKontroll = __decorate([
        core_1.Component({
            selector: "registrering",
            templateUrl: "./app/Registrering.html",
            providers: [skjemaservice_1.SkjemaService],
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, skjemaservice_1.SkjemaService])
    ], SkjemaKontroll);
    return SkjemaKontroll;
}());
exports.SkjemaKontroll = SkjemaKontroll;
//# sourceMappingURL=skjemakontroll.component.js.map
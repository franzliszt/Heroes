﻿import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import "rxjs/add/operator/map";
import { Soknad } from "./soknad";
import { Kalkulator } from "./kalkulator";
import { SkjemaService } from "./skjemaservice";


@Component({
    selector: "registrering",
    templateUrl: "./app/Registrering.html",
    providers: [SkjemaService]
})

export class SkjemaKontroll implements OnInit {
    // flagg 
    visSkjema: boolean;
    visKalkulator: boolean;
    visning: boolean;
    laster: boolean;
    skjemaStatus: string;
    finnMinSoknad: boolean;
    feilmelding: boolean;
    velkommen: boolean;
    okBoks: boolean;

    // for feilmeldinger
    melding: string;

    skjema: FormGroup;

    constructor(private fb: FormBuilder, private service: SkjemaService) {
        this.skjema = fb.group({
            id: ["", Validators.pattern("[0-9]{1,1000}")],
            personnummer: ["", Validators.pattern("[0-9]{11}")],
            mobiltelefon: ["", Validators.pattern("[0-9]{8}")],
            // ikke helt bra -- epost
            epost: ["", Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}")],
            belop: ["", Validators.pattern("[0-9]{4,7}")],
            nedbetalingstid: ["", Validators.pattern("[0-9]{1,2}")],
            avdrag: [""]
        });
    }

    ngOnInit(): void {
        this.laster = true;
        this.skjemaStatus = "registrer";
        this.visSkjema = false;
        this.velkommen = true;
    }

    vedSubmit() {
        if (this.skjemaStatus == "registrer") {
            this.lagreSoknad();
        } else if (this.skjemaStatus == "endre") {
            this.endreMinSoknad();
        } else {
        // vis feilvindu
            alert("FEIL");
        } 
    }

    // ferdig
    nullstill() {
        this.skjema.patchValue({ id: "" });
        this.skjema.patchValue({ personnummer: "" });
        this.skjema.patchValue({ mobiltelefon: "" });
        this.skjema.patchValue({ epost: "" });
        this.skjema.patchValue({ belop: "" });
        this.skjema.patchValue({ nedbetalingstid: "" });
        this.skjema.patchValue({ avdrag: "" });
    }

    // ikke ferdig
    visMinLaneSoknad() {
        this.nullstill();
        this.skjema.patchValue({ id: "" });
        this.visKalkulator = false;
        this.visSkjema = false;
        this.skjemaStatus = "endre";
        this.finnMinSoknad = true;
    }

    // virker ikke -- kalkulator må fikses
    beregn() {
        // hent data og sjekk om de er gyldige feks ikke 00
        let k = new Kalkulator();
        this.skjema.patchValue({avdrag: k.beregn(1000000, 30) });
    }

    // ikke ferdig
    tilKalulator() {
        // viser en kalkulator
        this.nullstill();
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = true;
    }


    /* *****Metoder som kaller på tjenesten mot api***** */

    // lagrer en søknad og virker -- ikke ferdig
    lagreSoknad(): void {
        this.laster = true;
        let soknad = this.opprettSoknad();
        if (soknad.personnummer == "" || soknad.mobiltelefon == "" || soknad.epost == "" ||
            soknad.belop == null || soknad.nedbetalingstid == null) {
            alert("Ingen tomme felter");
            return;
        }
        this.service.lagreSoknad(soknad).subscribe(
            retur => alert(retur + "XXXXXXXXXXX ===> OK"),
            error => {
                this.feil("Klarte ikke å lagre.");
            });
        this.laster = false;
    }
    

    // Hjelpemetode for å hente data fra skjemaet.
    private opprettSoknad(): Soknad {
        let soknad = new Soknad();
        soknad.id = this.skjema.value.id;
        soknad.personnummer = this.skjema.value.personnummer,
            soknad.mobiltelefon = this.skjema.value.mobiltelefon;
        soknad.epost = this.skjema.value.epost;
        soknad.belop = this.skjema.value.belop;
        soknad.nedbetalingstid = this.skjema.value.nedbetalingstid;
        return soknad;
    }

    // virker 
    hentMinSoknad(id) {
        if (id == "") {
            alert("Feltet er tomt");
        } else {
            this.service.hentSoknad(id).subscribe(
                retur => {
                    this.skjema.patchValue({ id: retur.id });
                    this.skjema.patchValue({ personnummer: retur.personnummer });
                    this.skjema.patchValue({ mobiltelefon: retur.mobiltelefon });
                    this.skjema.patchValue({ epost: retur.epost });
                    this.skjema.patchValue({ belop: retur.belop });
                    this.skjema.patchValue({ nedbetalingstid: retur.nedbetalingstid });
                    this.finnMinSoknad = false;
                    this.skjemaStatus = "endre";
                    this.visSkjema = true;
                },
                error => {
                    this.feil("Klarte ikke å hente søknad med søknadsnummer: " + id)
                });
        }
    }

    // Endrer søknad
    endreMinSoknad() {
        this.service.endreSoknad(this.opprettSoknad())
            .subscribe(
            retur => {
                alert("Endring ok");
                this.skjemaStatus = "registrer";
                this.nullstill();
            },
            error => {
                this.feil("Endring av søknad mislyktes.");
            });
        
    }

    slettSoknad(id) {
        this.service.slettSoknad(id)
            .subscribe(
            retur => {
                alert("Sletting ok");
                this.skjemaStatus = "registrer";
                this.nullstill();
            },
            error => {
                this.feil("Klarte ikke å slette søknad med søknadsnummer " + id);
            });
    }

    // til skjemaet
    tilbake() {
        this.velkommen = false;
        this.nullstill();
        this.visKalkulator = false;
        this.finnMinSoknad = false;
        this.feilmelding = false;
        this.skjemaStatus = "registrer";
        this.visSkjema = true;
    }

    // håndtering av feil-retur
    feil(inputFeil: string): void {
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = false;
        this.feilmelding = true;
        this.melding = inputFeil;
    }
}
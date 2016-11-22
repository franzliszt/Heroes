import { Component, OnInit } from "@angular/core";
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
        this.visKalkulator = false;
        this.skjemaStatus = "registrer";
        this.visSkjema = false;
        this.velkommen = true;
        this.feilmelding = false;
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

    // fra kalkulatoren
    tilbakeTilRegisreringsskjema() {
        this.nullstill();
        this.visSkjema = true;
        this.visKalkulator = false;
        this.skjemaStatus = "registrer";
        this.finnMinSoknad = false;
        
    }

    // ikke ferdig
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
        let soknad = this.opprettSoknad();
        alert(soknad.personnummer);
        this.service.lagreSoknad(soknad).subscribe(
            retur => alert(retur + "XXXXXXXXXXX ===> OK"),
            error => alert(<any>error + " FEIL"));
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
                    alert("Inne i henting og fant pnr som er " + retur.personnummer);
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
                error => alert(<any>error));
        }
        
    }

    // Endrer søknad -- virker -- må feilhåndtere
    endreMinSoknad() {
        this.service.endreSoknad(this.opprettSoknad())
            .subscribe(
            retur => {
                alert("Endring ok");
                this.skjemaStatus = "registrer";
                this.nullstill();
            },
            error => alert("FEIL"),
            () => alert("FERDIG"));
        
    }

    slettSoknad(id) {
        this.service.slettSoknad(id)
            .subscribe(
            retur => {
                alert("Sletting ok");
                this.skjemaStatus = "registrer";
                this.nullstill();
            },
            error => alert("FEIL"),
            () => alert("FERDIG"));
    }

    tilbake() {
        this.visSkjema = true;
        this.feilmelding = false;
    }
}
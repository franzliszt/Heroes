import { Component, OnInit, OnChanges, Input} from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import "rxjs/add/operator/map";
import { Soknad } from "./soknad";
import { Kalkulator } from "./kalkulator";
import { SkjemaService } from "./skjemaservice";

@Component({
    selector: "registrering",
    templateUrl: "./app/Registrering.html",
    providers: [SkjemaService],
})

export class SkjemaKontroll implements OnChanges {
// startverdier på slider
    belop: number = 150000;
    tid: number = 5;
    // variabel som brukes til å vise månedlige avdrag
    avdrag: number;

    // flagg 
    visSkjema: boolean;
    visKalkulator: boolean;
    visning: boolean;
    laster: boolean;
    skjemaStatus: string;
    finnMinSoknad: boolean;
    status: boolean;
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

    @Input() // ikke ferdig
    prop: number;
    ngOnChanges(changes: any): void {
        alert("JA");
    }

    ngOnInit(): void {
        this.nullstill();
        this.ut();
        //this.skjema.valid = false;
        this.laster = true;
        this.skjemaStatus = "registrer";
        this.visSkjema = false;
        this.velkommen = false;
        this.visKalkulator = true;
    }

    vedSubmit(): void {
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
    nullstill(): void {
        this.skjema.patchValue({ id: "" });
        this.skjema.patchValue({ personnummer: "" });
        this.skjema.patchValue({ mobiltelefon: "" });
        this.skjema.patchValue({ epost: "" });
        this.skjema.patchValue({ belop: "" });
        this.skjema.patchValue({ nedbetalingstid: "" });
        this.skjema.patchValue({ avdrag: "" });
    }

    // ikke ferdig
    visMinLaneSoknad(): void {
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
        let belop = this.skjema.value.belop;
        let tid = this.skjema.value.netbetalingstid;
        this.skjema.patchValue({ avdrag: k.beregn(belop, tid) });
    }

    // viser søknadsskjema
    tilSkjema() {
        this.finnMinSoknad = false;
        this.visSkjema = true;
        this.visKalkulator = false;
    }

    // kalkulerer avdrag pr mnd
    ut(): void {
        let y = (0.07 * this.belop) /
            (1 - Math.pow((1 + 0.079), -this.tid));
        this.avdrag = (parseFloat((y / 12).toFixed(2)));
    }

    /* *****Metoder som kaller på tjenesten mot api***** */

    // lagrer en søknad og virket -- ikke ferdig
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
                this.statusmelding("Klarte ikke å lagre.");
            });
        this.laster = false;
    }
    

    // Hjelpemetode for å hente data fra skjemaet.
    private opprettSoknad(): Soknad {
        let soknad = new Soknad();
        //soknad.id = 
        soknad.personnummer = this.skjema.value.personnummer;
        soknad.mobiltelefon = this.skjema.value.mobiltelefon;
        soknad.epost = this.skjema.value.epost;
        soknad.belop = this.belop;
        soknad.nedbetalingstid = this.tid;
        soknad.avdragPrMnd = this.avdrag;
        alert(soknad.avdragPrMnd + " " + soknad.belop + " " + soknad.nedbetalingstid);
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
                    this.belop = retur.belop;
                    this.tid = retur.nedbetalingstid;
                    this.skjema.patchValue({ nedbetalingstid: this.tid });
                    this.finnMinSoknad = false;
                    this.skjemaStatus = "endre";
                    this.visSkjema = true;
                },
                error => {
                    this.statusmelding("Klarte ikke å hente søknad med søknadsnummer: " + id)
                });
        }
    }

    // Endrer søknad
    endreMinSoknad() {
        alert("HER?");
        let soknad = this.opprettSoknad();
        this.service.endreSoknad(soknad)
            .subscribe(
            retur => {
                this.statusmelding("Søknad lagret. Se dine søknader ved å bruke ditt personnummer.");
                this.skjemaStatus = "registrer";
                this.nullstill();
            },
            error => {
                this.statusmelding("Endring av søknad mislyktes.");
            });
    }

    // Fungerer.
    slettSoknad(id) {
        this.service.slettSoknad(id)
            .subscribe(
            retur => {
                alert("Sletting ok");
                this.skjemaStatus = "registrer";
                this.nullstill();
            },
            error => {
                this.statusmelding("Klarte ikke å slette søknad med søknadsnummer " + id);
            });
    }


    // til kalkulator
    tilbake() {
        this.velkommen = false;
        this.visKalkulator = true;
        this.finnMinSoknad = false;
        this.status = false;
        this.visSkjema = false;
    }

    // håndtering av feil-retur
    statusmelding(inputFeil: string): void {
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = false;
        this.feilmelding = true;
        this.melding = inputFeil;
    }
}
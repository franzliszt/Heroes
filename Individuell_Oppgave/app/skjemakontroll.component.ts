import { Component, OnInit, Input} from "@angular/core";
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

export class SkjemaKontroll implements OnInit {
    // startverdier på slider
    belop: number;
    tid: number;
    // variabel som brukes til å vise månedlige avdrag
    avdrag: number;

    // Flagg for å bestemme visninger i html.
    visSkjema: boolean;
    visKalkulator: boolean;
    visning: boolean;
    laster: boolean;
    skjemaStatus: string;
    finnMinSoknad: boolean;
    status: boolean;
    okBoks: boolean;
    visListe: boolean;
    tomInput: boolean;

    // for tilbakemeldinger
    melding: string;

    skjema: FormGroup;
    alleSoknader: Array<Soknad>;
    kalkulator: Kalkulator;

    // private service er den som brukes ved kall som går mot api/Bruker.
    constructor(private fb: FormBuilder, private service: SkjemaService) {
        this.skjema = fb.group({
            id: ["", Validators.pattern("[0-9]{1,10}")],
            personnummer: ["", Validators.pattern("[0-9]{11}")],
            mobiltelefon: ["", Validators.pattern("[0-9]{8}")],
            epost: ["", Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}")],
            belop: ["", Validators.pattern("[0-9]{4,7}")],
            nedbetalingstid: ["", Validators.pattern("[0-9]{1,2}")],
            avdrag: [""]
        });
    }

    // Initialiserer nødvendighet.
    ngOnInit(): void {
        this.kalkulator = new Kalkulator();
        this.settStartverdier();
        this.laster = true;
        this.skjemaStatus = "registrer";
        this.visSkjema = false;
        this.visKalkulator = true;
    }

    vedSubmit(): void {
        if (this.skjemaStatus == "registrer") {
            this.lagreSoknad();
        } else if (this.skjemaStatus == "endre") {
            this.endreMinSoknad();
        } else {
            this.statusmelding("En alvorlig feil har oppstått." +
                "\nVennligst prøv igjen litt senere");
        }
    }

    // Viser vinduet for å skrive inn personnummer.
    visMinLaneSoknad(): void {
        this.fjern();
        this.nullstill();
        this.settStartverdier();
        this.melding = "";
        this.skjema.patchValue({ personnummer: "" });
        this.visKalkulator = false;
        this.visSkjema = false;
        this.visListe = false;
        this.finnMinSoknad = true;
    }

    // Viser søknadsskjemaet.
    tilSkjema(): void {
        this.fjern();
        if (this.skjemaStatus == "registrer") { this.nullstill(); }
        this.finnMinSoknad = false;
        this.visSkjema = true;
        this.visKalkulator = false;
    }

    // Oppdaterer avdrag hver gang slidere endres.
    kalkulerAvdrag(): void {
        this.avdrag = this.kalkulator.beregn(this.belop, this.tid);
    }


    /* *****Metoder som subscribes***** */

    // lagrer en søknad og virket -- ikke ferdig
    lagreSoknad(): void {
        this.laster = true;
        let soknad = this.opprettSoknad();

        if (soknad.personnummer == "" || soknad.mobiltelefon == "" ||  soknad.epost == "") {
            this.skjema.patchValue({ personnummer: "" });
            this.melding = "Ingen tomme felt.";
            this.tomInput = true;
        } else {
            this.fjern();
            this.service.lagreSoknad(soknad).subscribe(
                retur => {
                    this.ok("Søknad lagret med søknadsnummer " + retur.id + ".\n" +
                        "Bruk ditt personnummer for å se dine søknader.");
                    this.settStartverdier();
                },
                error => {
                    this.statusmelding("Klarte ikke å lagre.");
                });
            this.laster = false;
        }
    }

    // Henter en spesifikk søknad som skal endres og fyller ut skjemaet.
    hentMinSoknad(soknad: Soknad): void {
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
    }

    // Henter alle søknader tilhørende en bruker.
    hentMineSoknader(pnr: string): void {
        
        if (pnr == "") {
            this.melding = "Vennnligst fyll ut.";
            this.tomInput = true;
        } else {
            this.service.hentMineSoknader(pnr).subscribe(soknader => {
                if (soknader[0] != null) {
                    this.oppdaterSoknadsliste(soknader);
                    this.skjemaStatus = "endre";
                    this.visSkjema = false;
                    this.visKalkulator = false;
                    this.finnMinSoknad = false;
                    this.visListe = true;
                } else {
                    this.tomInput = true;
                    this.skjema.patchValue({ personnummer: "" });
                    this.melding = "Du er ikke registrert.";
                }
            },
                error => this.statusmelding("Klarte ikke hente din informasjon."));
        }
    }

    // Endrer søknad og gjør et kall for å hente oppdatert søknadsliste for en bruker.
    endreMinSoknad(): void {
        if (this.sjekkInput()) {
            this.tomInput = true;
            this.melding = "Ingen tomme felter.";
        } else {
            this.fjern();
            let soknad = this.opprettSoknad();
            soknad.id = this.skjema.value.id;
            this.service.endreSoknad(soknad)
                .subscribe(
                retur => {
                    this.hentMineSoknader(soknad.personnummer);
                },
                error => {
                    this.statusmelding("Endring av søknad mislyktes.");
                });
        }
    }

    // Sletter en søknad og oppdaterer visningen av søkerens søknader.
    slettSoknad(id): void {
        this.service.slettSoknad(id)
            .subscribe(
            retur => {
                if (retur) {
                    this.oppdaterSoknadsliste(retur);
                    this.visSkjema = false;
                    this.finnMinSoknad = false;
                    this.visListe = true;
                };
            },
            error => {
                this.statusmelding("Klarte ikke å slette søknad med søknadsnummer " + id);
            });
    }


    // Startverdier på slidere.
    private settStartverdier(): void {
        this.belop = 150000;
        this.tid = 5;
        this.kalkulerAvdrag();
    }

    // Hjelpemetode for å hente data fra skjemaet og oppretter en søknad.
    private opprettSoknad(): Soknad {
        let soknad = new Soknad();
        soknad.personnummer = this.skjema.value.personnummer;
        soknad.mobiltelefon = this.skjema.value.mobiltelefon;
        soknad.epost = this.skjema.value.epost;
        soknad.belop = this.belop;
        soknad.nedbetalingstid = this.tid;
        soknad.avdragPrMnd = this.avdrag;
        return soknad;
    }

    // Oppdaterer et array av søknader.
    private oppdaterSoknadsliste(soknader: any): void {
        this.alleSoknader = [];
        for (let soknad of soknader) {
            this.alleSoknader.push(soknad);
            this.laster = false;
        }
    }

    // Viser en meldingsboks med informasjon når en operasjon går ikke bra.
    private statusmelding(inputFeil: string): void {
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = false;
        this.status = true;
        this.melding = inputFeil;
    }

    // Viser en meldingsboks med informasjon når en operasjon går bra.
    private ok(okMelding: string): void {
        this.finnMinSoknad = false;
        this.visSkjema = false;
        this.visKalkulator = false;
        this.visListe = false;
        this.okBoks = true;
        this.melding = okMelding;
        this.nullstill();
    }

    // Nullstiller skjema.
    private nullstill(): void {
        this.skjema.patchValue({ id: "" });
        this.skjema.patchValue({ personnummer: "" });
        this.skjema.patchValue({ mobiltelefon: "" });
        this.skjema.patchValue({ epost: "" });
        this.skjema.patchValue({ belop: "" });
        this.skjema.patchValue({ nedbetalingstid: "" });
        this.skjema.patchValue({ avdrag: "" });
    }

    // Sjekker om noen felter er tomme.
    private sjekkInput(): boolean {
        return this.skjema.value.personnummer == "" ||  this.skjema.value.mobiltelefon == "" ||
            this.skjema.value.epost == "";
        
    }

    // Avslutter visning av alle søknader og endringsfunksjonalitet og returnerer til lånekalkulatoren.
    avbryt(): void {
        this.skjemaStatus = "registrer";
        this.nullstill(); // må endres
        this.settStartverdier();
        this.visSkjema = false;
        this.visListe = false;
        this.visKalkulator = true;
    }

    // Går til oversikten over alle søknader registrert på en kunde.
    tilOversikt(): void{
        this.visSkjema = false;
        this.visKalkulator = false;
        this.visListe = true;
    }

    // Sender til lånekalkulatoren.
    tilbake(): void {
        (this.visListe) ? !this.visKalkulator : this.visKalkulator = true, this.visSkjema = false;
        this.finnMinSoknad = false;
        this.status = false;
        this.okBoks = false;
    }

    // Fjerner feilmelding.
    fjern(): void {
        this.tomInput = false;
        this.melding = null;
    }
}
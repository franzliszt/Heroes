using System;
using System.Collections.Generic;
using System.Linq;
using Individuell_Oppgave.MODEL;
using System.Diagnostics;

namespace Individuell_Oppgave.DAL {
    public class DB {
        public Soknad lagre(Soknad nySoknad) {
            using (var db = new DatabaseContext()) {
                try {
                    var funnetPnr = db.Personer.FirstOrDefault(p => p.Personnummer == nySoknad.personnummer);
                    if (funnetPnr == null) {
                        var ny = new PersonDB() {
                            Personnummer = nySoknad.personnummer,
                            Mobiltelefon = nySoknad.mobiltelefon,
                            Epost = nySoknad.epost
                        };
                        db.Personer.Add(ny);
                    }
                    var s = new SoknadDB() {
                        Personnummer = nySoknad.personnummer,
                        Belop = nySoknad.belop,
                        Nedbetalingstid = nySoknad.nedbetalingstid,
                        AvdragPrMnd = nySoknad.avdragPrMnd
                    };
                    db.Soknader.Add(s);
                    db.SaveChanges();
                    nySoknad.id = s.SoknadsID;
                    return nySoknad;
                } catch (Exception e) {
                    return null;
                }
            }
        }


        public bool endreSoknad(Soknad nySoknad) {
            using (var db = new DatabaseContext()) {
                var funnetPnr = db.Personer.FirstOrDefault(p => p.Personnummer == nySoknad.personnummer);
                if (funnetPnr != null) {
                    SoknadDB finnSoknad = db.Soknader.FirstOrDefault(s => s.SoknadsID == nySoknad.id);
                    if (finnSoknad != null) {
                        try {
                            funnetPnr.Mobiltelefon = nySoknad.mobiltelefon;
                            finnSoknad.Nedbetalingstid = nySoknad.nedbetalingstid;
                            funnetPnr.Epost = nySoknad.epost;
                            finnSoknad.AvdragPrMnd = nySoknad.avdragPrMnd;
                            finnSoknad.Belop = nySoknad.belop;
                            db.SaveChanges();
                            return true;
                        } catch (Exception e) {
                            return false;
                        }
                    }
                }
            }
            return false;
        }


        public List<Soknad> slettSoknad(int id) {
            using (var db = new DatabaseContext()) {
                SoknadDB funnetSoknad = db.Soknader.FirstOrDefault(s => s.SoknadsID == id);
                if (funnetSoknad == null) { return null; }
                string tempPnr = funnetSoknad.Personnummer;
                try {
                    db.Soknader.Remove(funnetSoknad);
                    db.SaveChanges();
                    // henter oppdatert liste
                    return hentMineSoknader(tempPnr);
                } catch (Exception e) {
                    return null;
                }
            }
        }

        // henter alle søknader registrert på et personnummer
            public List<Soknad> hentMineSoknader(string pnr) {
            using (var db = new DatabaseContext()) {
                var hentPerson = db.Personer.FirstOrDefault(p => p.Personnummer == pnr);
                if (hentPerson == null) { return null; }

                var listeFraDB = db.Soknader.Where(p => p.Personnummer.Equals(pnr)).ToList();
                if (listeFraDB == null) { return null; }

                List<Soknad> mineSoknader = new List<Soknad>();
                listeFraDB.ForEach(s => mineSoknader.Add(new Soknad() {
                    id = s.SoknadsID,
                    personnummer = hentPerson.Personnummer,
                    mobiltelefon = hentPerson.Mobiltelefon,
                    epost = hentPerson.Epost,
                    belop = s.Belop,
                    nedbetalingstid = s.Nedbetalingstid,
                    avdragPrMnd = s.AvdragPrMnd
                }));
                return mineSoknader;
            }
        }
    }
}
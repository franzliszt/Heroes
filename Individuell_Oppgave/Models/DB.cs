using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Individuell_Oppgave.Models {
    public class DB {

        // Fungerer, men burde returnere søknadsID.--string
        public string lagre(Soknad p) {
            using (var db = new DatabaseContext()) {
                var s = new SoknadDB() {
                    Personnummer = p.personnummer,
                    Mobiltelefon = p.mobiltelefon,
                    Epost = p.epost,
                    Belop = p.belop,
                    Nedbetalingstid = p.nedbetalingstid,
                    AvdragPrMnd = p.avdragPrMnd
                };
                try {
                    db.Soknader.Add(s);
                    string soknadsNr = s.SoknadsID.ToString();
                    db.SaveChanges();
                    return soknadsNr;
                } catch (Exception e) {
                    return null;
                }
            }
        }

        public Soknad hentMinSoknad(int id) {
            using (var db = new DatabaseContext()) {
                var funnet = db.Soknader.FirstOrDefault(s => s.SoknadsID == id);
                if (funnet != null) {
                    Soknad minSoknad = 
                        (from s in db.Soknader
                            where s.SoknadsID == id
                            select new Soknad() {
                                id = s.SoknadsID,
                                personnummer = s.Personnummer,
                                mobiltelefon = s.Mobiltelefon,
                                epost = s.Epost,
                                belop = s.Belop,
                                nedbetalingstid = s.Nedbetalingstid,
                                avdragPrMnd = s.AvdragPrMnd
                            }).First();
                    return minSoknad;
                } else {
                    return null;
                }
            }
        }

        // Fungerer
        public bool endreSoknad(Soknad nySoknad) {
            using (var db = new DatabaseContext()) {
                SoknadDB finnSoknad = db.Soknader.FirstOrDefault(s => s.SoknadsID == nySoknad.id);
                if (finnSoknad != null) {
                    // endrer soknad
                    try {
                        finnSoknad.Mobiltelefon = nySoknad.mobiltelefon;
                        finnSoknad.Nedbetalingstid = nySoknad.nedbetalingstid;
                        finnSoknad.Epost = nySoknad.epost;
                        finnSoknad.Personnummer = nySoknad.personnummer;
                        finnSoknad.AvdragPrMnd = nySoknad.avdragPrMnd;
                        finnSoknad.Belop = nySoknad.belop;
                        db.SaveChanges();
                        return true;
                    } catch(Exception e) {
                        return false;
                    }
                }
            }
            return false;
        }

        // fungerer
        public bool slettSoknad(int id) {
            using (var db = new DatabaseContext()) {
                SoknadDB sjekkSoknad = db.Soknader.FirstOrDefault(s => s.SoknadsID == id);
                if (sjekkSoknad == null) { return false; }

                // fant søknadet
                try {
                    db.Soknader.Remove(sjekkSoknad);
                    db.SaveChanges();
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }
        }

        // henter alle lagrede søknader
        public List<Soknad> hentAlleSoknader() {
            using (var db = new DatabaseContext()) {

                List<Soknad> soknader = db.Soknader.Select(s => new Soknad() {
                    id = s.SoknadsID,
                    personnummer = s.Personnummer,
                    mobiltelefon = s.Mobiltelefon,
                    epost = s.Epost,
                    belop = s.Belop,
                    nedbetalingstid = s.Nedbetalingstid,
                    avdragPrMnd = s.AvdragPrMnd
                }).ToList();

                if (soknader == null) { return null; }
                
                return soknader;
            }
        }

        // henter alle søknader registrert på et personnummer
        public List<Soknad> hentMineSoknader(string pnr) {
            using (var db = new DatabaseContext()) {

                var listeFraDB = db.Soknader.Where(p => p.Personnummer == pnr).ToList();
                if (listeFraDB == null) { return null; }

                List<Soknad> mineSoknader = new List<Soknad>();
                listeFraDB.ForEach(s => mineSoknader.Add(new Soknad() {
                    id = s.SoknadsID,
                    personnummer = s.Personnummer,
                    mobiltelefon = s.Mobiltelefon,
                    epost = s.Epost,
                    belop = s.Belop,
                    nedbetalingstid = s.Nedbetalingstid,
                    avdragPrMnd = s.AvdragPrMnd
                }));
                return mineSoknader;
            }
        }
    }
}
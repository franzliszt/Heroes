using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Individuell_Oppgave.Models {
    public class DB {

        // Fungerer, men burde returnere søknadsID.--string
        public Soknad lagre(Soknad nySoknad) {
            
            using (var db = new DatabaseContext()) {
                
                var s = new SoknadDB() {
                    Personnummer = nySoknad.personnummer,
                    Mobiltelefon = nySoknad.mobiltelefon,
                    Epost = nySoknad.epost,
                    Belop = nySoknad.belop,
                    Nedbetalingstid = nySoknad.nedbetalingstid,
                    AvdragPrMnd = nySoknad.avdragPrMnd
                };
                try {
                    db.Soknader.Add(s);
                    db.SaveChanges();
                    nySoknad.id = s.SoknadsID;
                    return nySoknad;
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
                }
                return null;
            }
        }

        // Fungerer
        public bool endreSoknad(Soknad nySoknad) {
            using (var db = new DatabaseContext()) {
                SoknadDB finnSoknad = db.Soknader.FirstOrDefault(s => s.SoknadsID == nySoknad.id);
                if (finnSoknad != null) {
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
                        // Logge til en fil
                        return false;
                    }
                }
            }
            return false;
        }

        // fungerer
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
                    Console.WriteLine("En exception har oppstått: " + e.Message.ToString());
                    return null;
                }
            }
        }

        // henter alle lagrede søknader -- ikke i bruk
        //public List<Soknad> hentAlleSoknader(string pnr) {
        //    using (var db = new DatabaseContext()) {
        //        List<Soknad> soknader = 
        //            db.Soknader.Select(s => new Soknad() {
        //                id = s.SoknadsID,
        //                personnummer = s.Personnummer,
        //                mobiltelefon = s.Mobiltelefon,
        //                epost = s.Epost,
        //                belop = s.Belop,
        //                nedbetalingstid = s.Nedbetalingstid,
        //                avdragPrMnd = s.AvdragPrMnd
        //        }).Where(p => p.personnummer == pnr).ToList();

        //        if (soknader == null) { return null; }
        //        return soknader;
        //    }
        //}

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
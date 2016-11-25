using System;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using Individuell_Oppgave.Models;
using System.Web.Script.Serialization;
using System.Diagnostics;
using System.Net;
using System.Collections.Generic;

namespace Individuell_Oppgave.Controllers {
    public class BrukerController : ApiController {
        
        // Denne metoden henter alle søknader tilhørende en søker.
        [HttpGet]
        public HttpResponseMessage Get(string id) {
            List<Soknad> mineSoknader = new DB().hentMineSoknader(id);
            if (mineSoknader != null) {
                var json = new JavaScriptSerializer();
                string jsonString = json.Serialize(mineSoknader);

                return new HttpResponseMessage() {
                    Content = new StringContent(jsonString, Encoding.UTF8, "application/json"),
                    StatusCode = HttpStatusCode.OK
                };
            }
            return new HttpResponseMessage() {
                StatusCode = HttpStatusCode.BadRequest,
                Content = new StringContent("Fant ingen søknader som samsvarte med personnummeret.")
            };

        }


        //[HttpGet]
        //public HttpResponseMessage Get(int id) {
        //    Soknad resultat = new DB().hentMinSoknad(id);

        //    if (resultat != null) {
        //        var json = new JavaScriptSerializer();
        //        string jsonString = json.Serialize(resultat);

        //        return new HttpResponseMessage() {
        //            Content = new StringContent(jsonString, Encoding.UTF8,
        //            "application/json"), StatusCode = HttpStatusCode.OK
        //        };
        //    } else {
        //        return new HttpResponseMessage() {
        //            StatusCode = HttpStatusCode.BadRequest,
        //            Content = new StringContent("Fant ingen søknader som samsvarte med søknadsnummeret.")
        //        };
        //    }
        //}

        // henter alle søknader til en person
        //public HttpResponseMessage Get(string pnr, int i = 0) {
        //    List<Soknad> liste = new DB().hentMineSoknader(pnr);
        //    if (liste != null) {
        //        var j = new JavaScriptSerializer();
        //        return new HttpResponseMessage() {
        //            Content = new StringContent(j.Serialize(liste), Encoding.UTF8, "application/json"),
        //            StatusCode = HttpStatusCode.OK
        //        };
        //    } else {
        //        return new HttpResponseMessage() {
        //            StatusCode = HttpStatusCode.BadRequest,
        //            Content = new StringContent("Fant ingen søknader som samsvarte med personnummeret.")
        //        };
        //    }
        //}

        // lagrer en søknad

        // LAGRE
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Soknad nySoknad) {
            if (ModelState.IsValid) {
                // Returnerer søknaden for å gi søknadsnummeret til brukeren etter at den er lagret.
                Soknad soknadsNr = new DB().lagre(nySoknad);
                if (soknadsNr != null) {
                    var j = new JavaScriptSerializer();
                    string jsonstring = j.Serialize(soknadsNr);
                    return new HttpResponseMessage() {
                        Content = new StringContent(jsonstring, Encoding.UTF8, "application/json"), StatusCode = HttpStatusCode.OK
                    };
                }
            }
            return new HttpResponseMessage() {
                StatusCode = HttpStatusCode.BadRequest,
                Content = new StringContent("Feil i registring av søknad.")
            };
        }

        [HttpPut]
        public HttpResponseMessage Put([FromBody] Soknad s) {
            if (ModelState.IsValid) {
                bool endret = new DB().endreSoknad(s);
                if (endret) {
                    return new HttpResponseMessage() {
                        StatusCode = HttpStatusCode.OK
                    };
                }
            }
            return new HttpResponseMessage() {
                StatusCode = HttpStatusCode.NotFound,
                Content = new StringContent("Klarte ikke endre søknad.")
            };
        }

        
        [HttpDelete]
        public HttpResponseMessage Delete(int id) {
            var soknader = new DB().slettSoknad(id);
            if (soknader != null) {
                soknader.ForEach(s => Debug.WriteLine("XXXXXXXXXXXXXXXXX " + s.belop));
                // sletting utført og returnerer oppdatert liste med søknader.
                var json = new JavaScriptSerializer();
                var jsonstring = json.Serialize(soknader);
                return new HttpResponseMessage() {
                    Content = new StringContent(jsonstring, Encoding.UTF8, "application/json"), StatusCode = HttpStatusCode.OK
                };
            }
            
            return new HttpResponseMessage() {
                StatusCode = HttpStatusCode.NotFound,
                Content = new StringContent("Klarte ikke å slette søknaden")
            };
        }
    }
}

using System;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using Individuell_Oppgave.MODEL;
using System.Web.Script.Serialization;
using System.Diagnostics;
using System.Net;
using System.Collections.Generic;
using Individuell_Oppgave.BLL;

namespace Individuell_Oppgave.Controllers {
    public class BrukerController : ApiController {
        
        // Denne metoden henter alle søknader tilhørende en søker.
        [HttpGet]
        public HttpResponseMessage Get(string id) {
            List<Soknad> mineSoknader = new DB_BLL().hentMineSoknader(id);
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

        // lagrer en søknad

        // LAGRE
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Soknad nySoknad) {
            if (ModelState.IsValid) {
                // Returnerer søknaden for å gi søknadsnummeret til brukeren etter at den er lagret.
                Soknad soknadsNr = new DB_BLL().lagre(nySoknad);
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
                bool endret = new DB_BLL().endreSoknad(s);
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
            var soknader = new DB_BLL().slettSoknad(id);
            if (soknader != null) {
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

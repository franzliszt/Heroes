using System.Collections.Generic;
using Individuell_Oppgave.DAL;
using Individuell_Oppgave.MODEL;


namespace Individuell_Oppgave.BLL {
    public class DB_BLL {
        public Soknad lagre(Soknad nySoknad) {
            return new DB().lagre(nySoknad);
        }

        public bool endreSoknad(Soknad nySoknad) {
            return new DB().endreSoknad(nySoknad);
        }

        public List<Soknad> slettSoknad(int id) {
            return new DB().slettSoknad(id);
        }

        public List<Soknad> hentMineSoknader(string pnr) {
            return new DB().hentMineSoknader(pnr);
        }
    }
}

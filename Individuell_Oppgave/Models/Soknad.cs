using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Individuell_Oppgave.Models {
    public class Soknad {
        public int id { get; set; }
        public string personnummer { get; set; }
        public string mobiltelefon { get; set; }
        public string epost { get; set; }
        public int belop { get; set; }
        public int nedbetalingstid { get; set; }
        public double avdragPrMnd { get; set; }
    }
}
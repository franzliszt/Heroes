namespace Individuell_Oppgave.DAL {
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Data.Entity;
    using System.Data.Entity.ModelConfiguration.Conventions;
    using System.Collections.Generic;


    public class DatabaseContext : DbContext {
        public DbSet<SoknadDB> Soknader { get; set; }

        public DatabaseContext()
            : base("name=DatabaseContext") {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder) {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }

    public class SoknadDB {
        [Key]
        public int SoknadsID { get; set; }
        public string Personnummer { get; set; }
        public string Mobiltelefon { get; set; }
        public string Epost { get; set; }
        public int Belop { get; set; }
        public double AvdragPrMnd { get; set; }
        public int Nedbetalingstid { get; set; }
    }
}
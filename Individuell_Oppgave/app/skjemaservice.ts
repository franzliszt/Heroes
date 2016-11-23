import { Headers, Response, Http, RequestOptions } from "@angular/http";
import { Injectable } from "@angular/core";
import { Soknad } from "./soknad";
import "rxjs/add/operator/toPromise";
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class SkjemaService {
    private url: string = "api/bruker";
    private headers = new Headers({ "Content-Type": "application/json" });
    private options = new RequestOptions({ headers: this.headers });

   constructor(private _http: Http) {}

   private feil(error: any): Promise<any> {
       return Promise.reject(error.message || error);
   }

   // Lagrer en søknad. -- (fortsetter å feile)
   lagreSoknad(soknad: Soknad): any {
       alert("LAgreservice");
       let body: string = JSON.stringify(soknad);

       return this._http.post("api/Bruker", body, this.options)
           .map(returData => returData.toString())
   }

   // Endrer søknad -- fungerer
   endreSoknad(endretSoknad: Soknad) {
       let body: string = JSON.stringify(endretSoknad);
       return this._http.put("api/Bruker", body, this.options)
           .map(returData => returData.toString())
   }

   // Henter en søknad -- fungerer
   // må håndtere feilmeldinger og annen retur
   hentSoknad(id): any {
       return this._http.get("api/Bruker/" + id)
           .map((returdata: Response) => returdata.json())
           .catch((error: any) => Observable.throw(error.json().error || "Feil med server."));
   }

   // fungerer, men må skrives om
   slettSoknad(id): Observable<any> {
       return this._http.delete("api/Bruker/" + id)
           .map(returdata => returdata.toString())
   }
}
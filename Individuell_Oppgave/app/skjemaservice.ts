import { Headers, Response, Http, RequestOptions } from "@angular/http";
import { Injectable } from "@angular/core";
import { Soknad } from "./soknad";
import "rxjs/add/operator/toPromise";
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class SkjemaService {
    private headers = new Headers({ "Content-Type": "application/json" });
    private options = new RequestOptions({ headers: this.headers });

   constructor(private _http: Http) {}

   hentMineSoknader(id: string): any {
       return this._http.get("api/Bruker/" + id)
           .map((returdata: Response) => returdata.json())
   }

   // Lagrer en søknad. -- (fortsetter å feile)
   lagreSoknad(soknad: Soknad): any {
       let body: string = JSON.stringify(soknad);

       return this._http.post("api/Bruker", body, this.options)
           .map((returData: Response) => returData.json())
   }

   // Endrer søknad -- fungerer
   endreSoknad(endretSoknad: Soknad) {
       let body: string = JSON.stringify(endretSoknad);
       return this._http.put("api/Bruker", body, this.options)
           .map(returData => returData.toString())
   }

   // Henter en søknad -- fungerer
   hentSoknad(id): any {
       return this._http.get("api/Bruker/" + id)
           .map((returdata: Response) => returdata.json())
   }

   // fungerer, men må skrives om
   slettSoknad(id): any {
       return this._http.delete("api/Bruker/" + id)
           .map((returdata: Response) => returdata.json())
   }
}
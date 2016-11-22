import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";
import { ReactiveFormsModule } from "@angular/forms";

import { SkjemaKontroll } from "./skjemakontroll.component";
import { AppComponent } from "./app.component";
import { SkjemaService } from "./skjemaservice";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        SkjemaKontroll
    ],
    providers: [SkjemaService],
    bootstrap: [AppComponent]
})

export class AppModule { }
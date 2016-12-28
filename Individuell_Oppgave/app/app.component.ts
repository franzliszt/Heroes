import { Component } from "@angular/core";

@Component({
    selector: "my-app",
    template: `
        <h1>{{title}}</h1>
        <h3><a routerLink="/heroes">Heroes</a></h3>
        <router-outlet></router-outlet>
    `
})
export class AppComponent {
    title = 'Tour of Heroes';
}
// Keep the Input import for now, we'll remove it later:
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { HeroService } from './hero.service';

@Component({
    moduleId: module.id,
    selector: 'my-hero-detail',
    templateUrl: 'hero-detail.component.html',
    styleUrls: ["hero-detail.component.css"]
})
export class HeroDetailComponent implements OnInit {
    // denne komponenten aksepterer input
    //@Input() hero: Hero;

    constructor(
        private heroService: HeroService,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    // bruker params observable til hente id parameterverdi fra ActivatedRoute
    // og bruker HeroService til å hente denne hero.
    // Hvis brukeren navigerer igjen til denne komponenten i mens getHero foregår
    // switchMap kansellerer den gamle forespørselen før den kaller getHero igjen.
    // Route parametere er alltid string, (+) operatoren konverterer route parameter til string.
    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.heroService.getHero(+params['id']))
            .subscribe(hero => this.hero = hero);
    }

    // gpr tilbake et trinn i nettleserens historikk
    goBack(): void {
        this.location.back();
    }
}
"use strict";
var registrer_component_1 = require("./registrer.component");
var ebdre_component_1 = require("./ebdre.component");
exports.routes = [
    {
        path: "",
        component: HomeComponent //må importeres
    },
    { path: "registrer", component: registrer_component_1.Registrer },
    { path: "endre", component: ebdre_component_1.Endre },
    { path: "mineSoknader/:pnr", component: MineSoknader }
];
//# sourceMappingURL=app.routes.js.map
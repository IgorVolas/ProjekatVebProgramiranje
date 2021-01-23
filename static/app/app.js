(function(angular){

    var app = angular.module("app", ["ui.router", "ui.bootstrap"]);

    app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $stateProvider.state({
            name: "pravnaLica",
            url: "/pravnaLica",
            templateUrl: "/app/components/lica/pravna_lica/pravna_lica.tpl.html",
            controller: "LicaCtrl",
            controllerAs: "plc"
        }).state("novoPravnoLice", {
            url: "/pravnaLica",
            templateUrl: "/app/components/lica/pravna_lica/novo_lice.html",
            controller: "LicaCtrl",
            controllerAs: "plc"
        }).state("pravnoLice", {
            url: "/pravnaLica/{id: int}",
            templateUrl: "/app/components/lica/pravna_lica/pravno_lice.tpl.html",
            controller: "LiceCtrl",
            controllerAs: "pllc"
        }).state("racuni", {
            url: "/racuni/{id: int}",
            templateUrl: "/app/components/racuni/racuni.tpl.html",
            controller: "RacuniCtrl",
            controllerAs: "rc"
        }).state("noviRacun", {
            url: "/noviRacun/{id: int}",
            templateUrl: "/app/components/racuni/novi_racun.html",
            controller: "RacuniCtrl",
            controllerAs: "rc"
        }).state("fizickaLica", {
            url: "/fizickaLica",
            templateUrl: "/app/components/lica/fizicka_lica/fizicka_lica.tpl.html",
            controller: "LicaCtrl",
            controllerAs: "plc"
        }).state("novoFizickoLice", {
            url: "/fizickaLica",
            templateUrl: "/app/components/lica/fizicka_lica/novo_lice.html",
            controller: "LicaCtrl",
            controllerAs: "plc"
        }).state("fizickoLice", {
            url: "/fizickaLica/{id: int}",
            templateUrl: "/app/components/lica/fizicka_lica/fizicko_lice.tpl.html",
            controller: "LiceCtrl",
            controllerAs: "pllc"
        }).state("transakcije", {
            url: "/transakcije",
            templateUrl: "/app/components/transakcije/transakcije.tpl.html",
            controller: "TransakcijeCtrl",
            controllerAs: "tc"
        }).state("transakcija", {
            url: "/transakcije/{id: int}",
            templateUrl: "/app/components/transakcije/transakcija.tpl.html",
            controller: "TransakcijaCtrl",
            controllerAs: "ttc"
        }).state("novaTransakcija", {
            url: "/transakcije",
            templateUrl: "/app/components/transakcije/nova_transakcija.html",
            controller: "TransakcijeCtrl",
            controllerAs: "tc"
        }).state("login", {
            url: "/",
            templateUrl: "/app/components/login/login.html",
            controller: "LoginCtrl",
            controllerAs: "lc"
        });
        $urlRouterProvider.otherwise("/");
    }]);

})(angular);
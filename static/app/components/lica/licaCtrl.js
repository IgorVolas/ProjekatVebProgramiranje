(function (angular) {
    var app = angular.module("app");
    
    app.controller("LicaCtrl", ["$http", function ($http) {
        var that = this;
        this.pravnaLica = [];
        this.fizickaLica = [];

        this.admin = {korisnicko_ime: "", lozinka: ""}

        this.ulogovaniKorisnik = {};

        this.novoPravnoLice = {
            "tip": "pravno",
            "ime": "",
            "adresa": "",
            "PIB": "",
            "maticni_broj": "",
            "obrisano": 0
        }

        this.novoFizickoLice = {
            "tip": "fizicko",
            "ime": "",
            "adresa": "",
            "PIB": null,
            "maticni_broj": "",
            "obrisano": 0
        }


        this.login = function() {
            $http.post("/login", that.admin).then(function(){
                that.dobaviPravnaLica();
                that.dobaviFizickaLica();
            }, function() {

            })
        }

        this.logout = function() {
            $http.get("/logout").then(function(){
                that.dobaviPravnaLica();
                that.dobaviFizickaLica();
            }, function() {

            })
        }

        this.dobaviPravnaLica = function() {
            $http.get("/pravnaLica").then(function(response){
                that.pravnaLica = response.data;
            }, function(response) {
                console.log("Greška pri dobavljanju lica! Kod: " + response.status);
            })
        }

        this.dodajPravnoLice = function() {
            $http.post("/pravnaLica", that.novoPravnoLice).then(function(response){
                that.alerts = [];
                that.alerts.push({ type: 'success', msg: 'Ovo lice je uspešno dodato.' });
                that.dobaviPravnaLica();

                that.novoPravnoLice = {
                    "tip": "pravno",
                    "ime": "",
                    "adresa": "",
                    "PIB": "",
                    "maticni_broj": "",
                    "obrisano": 0
                }
            }, function(response){
                console.log("Greška pri dodavanju lica! Kod: " + response.status);
            });
        }

        this.dobaviFizickaLica = function() {
            $http.get("/fizickaLica").then(function(response){
                that.fizickaLica = response.data;
            }, function(response) {
                console.log("Greška pri dobavljanju lica! Kod: " + response.status);
            })
        }

        this.dodajFizickoLice = function() {
            $http.post("/fizickaLica", that.novoFizickoLice).then(function(response){
                that.alerts = [];
                that.alerts.push({ type: 'success', msg: 'Ovo lice je uspešno dodato.' });

                that.novoFizickoLice = {
                    "tip": "fizicko",
                    "ime": "",
                    "adresa": "",
                    "PIB": null,
                    "maticni_broj": "",
                    "obrisano": 0
                }
            }, function(response){
                console.log("Greška pri dodavanju lica! Kod: " + response.status);
            });
        }

        this.ulogovaniKorisnik = function(){
            $http.get("/korisnik").then(function(response){
                that.ulogovaniKorisnik = response.data;
            }, function(){
                console.log("Greška pri dobavljanju korisnika! Kod: " + response.status);
            })
        }

        
        this.ulogovaniKorisnik();
        this.dobaviPravnaLica();
        this.dobaviFizickaLica();
    }]);
})(angular);
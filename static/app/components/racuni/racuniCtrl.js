(function(angular){
    var app = angular.module("app");

    app.controller("RacuniCtrl", ["$stateParams", "$http", function($stateParams, $http){
        var that = this;
        this.racuni = [];

        this.pravnoLice = {};
        this.fizickoLice = {};

        this.racun = {};

        this.noviRacun = {
            "broj": 0,
            "iznos": 0,
            "lica_id": $stateParams["id"],
            "obrisano": 0
        }

        this.ulogovaniKorisnik = {};

        this.alerts = [];
        
        this.closeAlert = function(index) {
            that.alerts.splice(index, 1);
        };


        this.dobaviRacune = function(id){
            that.noviRacun.lica_id = $stateParams["id"];
            $http.get("/racuni/"+that.noviRacun.lica_id).then(function(response){
                for(r of response.data){
                    if(r.obrisano == "0"){
                        r.obrisano = "ne";
                    }
                    else if(r.obrisano == "1"){
                        r.obrisano = "da";
                    }
                }
                that.racuni = response.data;
            }, function(response){
                console.log("Greška pri dobavljanju računa! Kod: " + response.status);
            })
        }

        this.dobaviRacun = function(id) {
            $http.get("/racun/"+id).then(function(response) {
                that.racun = response.data;
                that.ukloniRacun(id);
            }, function(response) {
                console.log(response.status);
            });
        }
        this.dobaviRacun1 = function(id) {
            $http.get("/racun/"+id).then(function(response) {
                that.racun = response.data;
                that.ponistiUklanjanjeRacuna(id);
            }, function(response) {
                console.log(response.status);
            });
        }

        this.ukloniRacun = function(id) {
            $http.put("/ukloniRacun/"+id, that.racun).then(
                function(response){
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ovaj račun više ne moze da učestvuje u transakcijama.' });
                    that.dobaviRacune($stateParams["id"]);
            }, function(response){
                    console.log("Greška pri uklanjanju računa! Kod: " + response.status);
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
            });
        }

        this.ponistiUklanjanjeRacuna = function(id){
            $http.put("/ponistiUklanjanjeRacuna/"+id, that.racun).then(
                function(response){
                    that.alerts = [];
                    that.alerts.push({ type: 'success', msg: 'Brisanje je uspešno poništeno.' });
                    that.dobaviRacune($stateParams["id"]);
            }, function(response){
                    console.log("Greška pri ponistavanju brisanja racuna! Kod: " + response.status);
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
            });
        }
        
        this.dodajRacun = function(id) {
            $http.post("/noviRacun", that.noviRacun).then(function(response){
                that.alerts.push({ type: 'success', msg: 'Ovaj račun je uspešno dodat.' });
                that.noviRacun.lica_id = id;
                that.dobaviRacune(id);

                that.noviRacun = {
                    "broj": 0,
                    "iznos": 0,
                    "lica_id": $stateParams["id"],
                    "obrisano": 0
                }
            }, function(){
                console.log("Greška pri dodavanju računa! Kod: " + response.status);
            });
        }

        this.dobaviPravnoLice = function(id_lica) {
            $http.get("/pravnaLica/"+id_lica).then(function(response) {
                that.pravnoLice = response.data;
            }, function(response) {
                console.log(response.status);
            });
        }

        this.dobaviFizickoLice = function(id_lica) {
            $http.get("/fizickaLica/"+id_lica).then(function(response) {
                that.fizickoLice = response.data;
            }, function(response) {
                console.log(response.status);
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
        this.dobaviRacune($stateParams["id"]);
        this.dobaviPravnoLice($stateParams["id"]);
        this.dobaviFizickoLice($stateParams["id"]);
    }]);
})(angular);
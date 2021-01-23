(function(angular) {
    angular.module("app").controller("LiceCtrl", ["$stateParams", "$http", function($stateParams, $http) {

        var that = this;
        this.pravnoLice = {};
        this.fizickoLice = {};

        this.racuni = [];
        this.racun_id;

        this.iznosiSaRacuna = [];
        this.negativniIznosiSaRacuna = [];

        this.korisnik = {};

        this.ulogovaniKorisnik = {};

        this.alerts = [];

        this.closeAlert = function(index) {
            that.alerts.splice(index, 1);
        };

        this.dobaviPravnoLice = function(id) {
            $http.get("/pravnaLica/"+id).then(function(response) {
                if(response.data.obrisano == "0"){
                    response.data.obrisano = "ne";
                }
                else if(response.data.obrisano == "1"){
                    response.data.obrisano = "da";
                }
                that.pravnoLice = response.data;
                that.dobaviKorisnika(that.pravnoLice.korisnik_id);
            }, function(response) {
                console.log(response.status);
            });
        }

        this.izmeniPravnoLice = function() {
            if(that.pravnoLice.obrisano == "ne"){
                that.pravnoLice.obrisano = 0;
            }
            else{
                that.pravnoLice.obrisano = 1;
            }
            $http.put("/pravnaLica/"+that.pravnoLice.id, that.pravnoLice).then(
                function(response) {
                    that.alerts = [];
                    that.alerts.push({ type: 'success', msg: 'Lice je uspešno izmenjeno.' });
                    that.dobaviPravnoLice(that.pravnoLice.id);
                }, function(response) {
                    console.log("Greška pri izmeni lica");
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
                    that.dobaviPravnoLice(that.pravnoLice.id)
                }
            )
        }

        this.ukloniPravnoLice = function(id) {
            $http.put("/ukloniPravnoLice/"+that.pravnoLice.id, that.pravnoLice).then(
                function(response){
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ovo lice više ne moze da učestvuje u transakcijama.' });
                    that.dobaviPravnoLice(that.pravnoLice.id);
            }, function(response){
                    console.log("Greška pri uklanjanju lica! Kod: " + response.status);
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
            });
        }

        this.ponistiUklanjanjePravnogLica = function(id){
            $http.put("/ponistiUklanjanjeLica/"+that.pravnoLice.id, that.pravnoLice).then(
                function(response){
                    that.alerts = [];
                    that.alerts.push({ type: 'success', msg: 'Brisanje je uspešno poništeno.' });
                    that.dobaviPravnoLice(that.pravnoLice.id);
            }, function(response){
                console.log("Greška pri uklanjanju lica! Kod: " + response.status);
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
            });
        }



        this.dobaviFizickoLice = function(id) {
            $http.get("/fizickaLica/"+id).then(function(response) {
                if(response.data.obrisano == "0"){
                    response.data.obrisano = "ne";
                }
                else if(response.data.obrisano == "1"){
                    response.data.obrisano = "da";
                }
                that.fizickoLice = response.data;
            }, function(response) {
                console.log(response.status);
            });
        }

        this.izmeniFizickoLice = function() {
            if(that.fizickoLice.obrisano == "ne"){
                that.fizickoLice.obrisano = 0;
            }
            else{
                that.fizickoLice.obrisano = 1;
            }
            $http.put("/fizickaLica/"+that.fizickoLice.id, that.fizickoLice).then(
                function(response) {
                    that.alerts = [];
                    that.alerts.push({ type: 'success', msg: 'Lice je uspešno izmenjeno.' });
                    that.dobaviFizickoLice(that.fizickoLice.id);
                }, function(response) {
                    console.log("Greška pri izmeni lica");
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
                    that.dobaviFizickoLice(that.fizickoLice.id)
                }
            )
        }

        this.ukloniFizickoLice = function(id) {
            $http.put("/ukloniFizickoLice/"+that.fizickoLice.id, that.fizickoLice).then(
                function(response){
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ovo lice više ne moze da učestvuje u transakcijama.' });
                    that.dobaviFizickoLice(that.fizickoLice.id);
            }, function(response){
                    console.log("Greška pri uklanjanju lica! Kod: " + response.status);
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
            });
        }

        this.ponistiUklanjanjeFizickogLica = function(id){
            $http.put("/ponistiUklanjanjeLica/"+that.fizickoLice.id, that.fizickoLice).then(
                function(response){
                    that.alerts = [];
                    that.alerts.push({ type: 'success', msg: 'Brisanje je uspešno poništeno.' });
                    that.dobaviFizickoLice(that.fizickoLice.id);
                    that.dobaviFizickoLice(that.fizickoLice.id);
            }, function(response){
                    console.log("Greška pri uklanjanju lica! Kod: " + response.status);
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
            });
        }

        this.dobaviRacune = function(id){
            $http.get("/racuni/"+id).then(function(response){
                that.racuni = [];
                for(racun of response.data){
                    if(racun.obrisano == "0"){
                        that.racuni.push(racun);
                    }
                }
            }, function(response){
                console.log("Greška pri dobavljanju računa! Kod: " + response.status);
            })
        }

        this.dobaviKorisnika = function(id){
            $http.get("/korisnici/"+id).then(function(response){
                that.korisnik = response.data;
            }, function(response){
                console.log("Greška pri dobavljanju korisnika! Kod: " + response.status);
            })
        }

        this.dobaviTransakcije = function(){
            $http.get("/transakcije").then(function(response){
                xIY = [];   
                for(transakcija of response.data){
                    if(transakcija.racuni_id1 == that.racun_id){
                        //that.iznosiSaRacuna.push(transakcija.iznos);
                        xIY.push({x:transakcija.id, y:transakcija.iznos});
                    }
                    else if(transakcija.racuni_id == that.racun_id){
                        //that.negativniIznosiSaRacuna.push(transakcija.iznos);
                        xIY.push({x:transakcija.id, y:-transakcija.iznos});
                    }
                }
            }, function(response){
                console.log("Greška pri dobavljanju transakcija! Kod: " + response.status);
            })
        }

        this.ulogovaniKorisnik = function(){
            $http.get("/korisnik").then(function(response){
                that.ulogovaniKorisnik = response.data;
            }, function(){
                console.log("Greška pri dobavljanju korisnika! Kod: " + response.status);
            })
        }

        
        this.ulogovaniKorisnik();
        this.dobaviPravnoLice($stateParams["id"]);
        this.dobaviFizickoLice($stateParams["id"]);
        this.dobaviRacune($stateParams["id"]);

    }]);
})(angular);
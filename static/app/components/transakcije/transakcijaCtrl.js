(function(angular){
    var app = angular.module("app");

    app.controller("TransakcijaCtrl", ["$stateParams", "$http", function($stateParams, $http){
        var that = this;

        this.transakcija = {};

        this.racun = {};
        this.racun1 = {};

        this.lice = {};
        this.lice1 = {};

        this.ulogovaniKorisnik = {};

        this.alerts = [];
        
        this.closeAlert = function(index) {
            that.alerts.splice(index, 1);
        };



        this.dobaviTransakciju = function(id){
            $http.get("/transakcije/"+id).then(function(response){
                that.transakcija = response.data;
                if(response.data.obrisano == "0"){
                    response.data.obrisano = "ne";
                }
                else if(response.data.obrisano == "1"){
                    response.data.obrisano = "da";
                }
                that.dobaviRacun(that.transakcija.racuni_id);
                that.dobaviRacun1(that.transakcija.racuni_id1);
            }, function(response){
                console.log("Greška pri dobavljanju transakcije! Kod: " + response.status);
            })
        }

        this.ukloniTransakciju = function(id){
            $http.put("/transakcije/"+id, that.transakcija).then(
                function(response){
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova transakcija je obrisana.' });
                    that.dobaviTransakciju(id);
            }, function(response){
                    console.log("Greška pri brisanju transakcije! Kod: " + response.status);
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
            })
        }

        this.ponistiUklanjanjeTransakcije = function(id){
            $http.put("/ponistiUklanjanjeTransakcije/"+that.transakcija.id, that.transakcija).then(
                function(response){
                    that.alerts = [];
                    that.alerts.push({ type: 'success', msg: 'Brisanje je uspešno poništeno.' });
                    that.dobaviTransakciju(id);
            }, function(response){
                    console.log("Greška pri ponistavanju brisanja transakcije! Kod: " + response.status);
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
            });
        }

        this.dobaviRacun = function(id){
            $http.get("/racun/"+id).then(function(response){
                that.racun = response.data;
                that.dobaviLice(that.racun.lica_id);
            }, function(response){
                console.log("Greška pri dobavljanju računa! Kod: " + response.status);
            })
        }

        this.dobaviRacun1 = function(id){
            $http.get("/racun/"+id).then(function(response){
                that.racun1 = response.data;
                that.dobaviLice1(that.racun1.lica_id);
            }, function(response){
                console.log("Greška pri dobavljanju računa1! Kod: " + response.status);
            })
        }

        this.dobaviLice = function(id){
            $http.get("/lice/"+id).then(function(response){
                that.lice = response.data;
            }, function(response){
                console.log("Greška pri dobavljanju lica! Kod: " + response.status);
            })
        }

        this.dobaviLice1 = function(id){
            $http.get("/lice/"+id).then(function(response){
                that.lice1 = response.data;
            }, function(response){
                console.log("Greška pri dobavljanju lica1! Kod: " + response.status);
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
        this.dobaviTransakciju($stateParams["id"]);
    }])
})(angular);
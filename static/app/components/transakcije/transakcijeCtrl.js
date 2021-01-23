(function(angular){
    var app = angular.module("app");
    app.controller("TransakcijeCtrl", ["$http", function($http){
        var that = this;

        this.transakcije = [];
        this.lica = [];

        this.lice_id;
        this.lice_id1;

        this.dodataLica = 0;

        this.racuni = [];
        this.racuni1 = [];

        this.racun = {};
        this.racun1 = {};

        this.novaTransakcija = {
            "iznos": 0,
            "racuni_id": null,
            "racuni_id1": null,
            "obrisano": 0
        };

        this.ulogovaniKorisnik = {};

        this.alerts = [];

        this.closeAlert = function(index) {
            that.alerts.splice(index, 1);
        };

        this.dobaviTransakcije = function(){
            $http.get("/transakcije").then(function(response){
                that.transakcije = response.data;
            }, function(response){
                console.log("Greška pri dobavljanju transakcija! Kod: " + response.status);
            })
        }

        this.dobaviLica = function(){
            $http.get("/lica").then(function(response){
                for(lice of response.data){
                    if(lice.obrisano == "0"){
                        that.lica.push(lice);
                    }
                }
            }, function(response){
                console.log("Greška pri dobavljanju lica! Kod: " + response.status);
            })
        }

        this.dodajLica = function(){
            that.dodataLica = 1;
            that.dobaviRacune(that.lice_id);
            that.dobaviRacune1(that.lice_id1);
        }

        this.dobaviRacune = function(){
            $http.get("/racuni/"+that.lice_id).then(function(response){
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

        this.dobaviRacune1 = function(){
            $http.get("/racuni/"+that.lice_id1).then(function(response){
                that.racuni1 = [];
                for(racun1 of response.data){
                    if(racun1.obrisano == "0"){
                        that.racuni1.push(racun1);
                    }
                }
            }, function(response){
                console.log("Greška pri dobavljanju računa1! Kod: " + response.status);
            })
        }

        this.dodajTransakciju = function(){
            $http.post("/transakcije", that.novaTransakcija).then(function(response){
                that.alerts = [];
                that.alerts.push({ type: 'success', msg: 'Transakcije je obavljena.\nStanja na računima ovih lica su promenjena.' });


                that.novaTransakcija = {
                    "iznos": 0,
                    "racuni_id": null,
                    "racuni_id1": null,
                    "obrisano": 0
                }
            }, function(response){
                console.log("Greška pri dobavljanju transakcije");
                that.alerts = [];
                that.alerts.push({ type: 'danger', msg: 'Ova akcija nije dozvoljena.' });
            })
        }

        this.dobaviRacun = function(id){
            $http.get("/racun/"+id).then(function(response){
                that.racun = response.data;
                if(that.racun.iznos >= that.novaTransakcija.iznos){
                    that.izmeniRacun(that.racun.id);
                    that.dobaviRacun1(that.novaTransakcija.racuni_id1);
                    that.dodajTransakciju();
                }
                else{
                    that.alerts = [];
                    that.alerts.push({ type: 'danger', msg: 'Nema dovoljno sredstava na ovom računu.' });
                }
            }, function(response){
                console.log("Greska pri dobavljanju racuna! Kod: " + response.status);
            })
        }

        this.dobaviRacun1 = function(id){
            $http.get("/racun/"+id).then(function(response){
                that.racun1 = response.data;
                if(that.racun.iznos >= that.novaTransakcija.iznos){
                    that.izmeniRacun1(that.racun1.id);
                }
            }, function(response){
                console.log("Greška pri dobavljanju računa1! Kod: " + response.status);
            })
        }

        this.izmeniRacun = function(id){
            $http.put("/racun/"+id+"/"+that.novaTransakcija.iznos, that.racun).then(function(response){
            }, function(response){
                console.log("Greška pri izmeni računa! Kod: " + response.status);
            })
        }

        this.izmeniRacun1 = function(id){
            $http.put("/racun1/"+id+"/"+that.novaTransakcija.iznos, that.racun1).then(function(response){
            }, function(response){
                console.log("Greška pri izmeni računa1! Kod: " + response.status);
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
        this.dobaviTransakcije();
        this.dobaviLica();
    }])
})(angular);
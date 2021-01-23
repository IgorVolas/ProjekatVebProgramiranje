(function(angular){
    var app = angular.module("app");

    app.controller("PretragaCtrl", ["$http", function($http){
        var that = this;

        this.pretraziLice = 0;
        this.tabela = 0;

        this.tabela1 = 0;

        this.ime;
        this.lica = [];


        this.svaLica = [];

        this.parametriPretrage = {
            uplatilac: null,
            primaoc: null,
            iznosOd: undefined,
            iznosDo: undefined
        }
        this.transakcije = [];



        this.lice = function(){
            that.pretraziLice = 1;
            that.pretraziTransakciju = 0;
            that.lica = [];
        }

        this.transakcija = function(){
            that.pretraziTransakciju = 1;
            that.pretraziLice = 0;
            that.tabela = 0;
        }

        this.dobaviLica = function(){
            that.tabela = 1;
            that.tabela1 = 0;
            that.lica = [];
            $http.get("/pretraga/"+that.ime).then(function(response){
                that.lica = response.data;
                that.ime = "";
            }, function(response){
                console.log("Greška pri pretrazi lica! Kod: " + response.status);
            })
        }

        this.dobaviTransakcije = function(){
            that.tabela1 = 1;
            that.tabela = 0;
            that.transakcije = [];
            $http.get("/pretragaTransakcije", {params: that.parametriPretrage}).then(function(response){
                that.transakcije = response.data;
            }, function(response){
                console.log("Greška pri pretrazi transakcije! Kod: " + response.status);
            })
        }

        this.dobaviSvaLica = function(){
            $http.get("/lica").then(function(response){
                that.svaLica = response.data;
            }, function(response){
                console.log("Greška pri dobavljanju svih lica! Kod: " + response.status);
            })
        }

        this.zatvori = function(){
            that.pretraziLice = 0;
            that.pretraziTransakciju = 0;
            that.tabela = 0;
            that.tabela1 = 0;
        }
       
        that.dobaviSvaLica();
    }])
})(angular);
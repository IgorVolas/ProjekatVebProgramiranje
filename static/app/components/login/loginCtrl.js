(function (angular) {
    var app = angular.module("app");

    app.controller("LoginCtrl", ["$http", "$state", function ($http, $state) {

        var that = this;

        this.admin = {
            korisnicko_ime: "",
            lozinka: ""
        }
        this.state = {
            loggedIn: false
        };

        this.ulogovaniKorisnik = {};

        this.alerts = [];

        
        this.closeAlert = function(index) {
            that.alerts.splice(index, 1);
        };
        
        
        this.login = function() {
            $http.post("/login", that.admin).then(function(){
                that.state.loggedIn = true;
                $state.go("pravnaLica", {}, {reload: true});
            }, function() {
                that.alerts.push({ type: 'danger', msg: 'Neuspešna prijava!' });
                that.admin = {korisnicko_ime: "", lozinka: ""}
            })
        }

        this.logout = function() {
            $http.get("/logout").then(function(){
                that.state.loggedIn = false;
                that.alerts.push({ type: 'success', msg: 'Uspešno ste se odjavili.' });
                $state.go("login", {}, {reload: true});
            }, function() {

            })
        }

        
    }]);
})(angular);
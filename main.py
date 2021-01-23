import flask
from flask import Flask
from flask import request

from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor

import datetime

from utils import mysql_db, secured
#from korisnik_blueprint import korisnik_blueprint

mysql_db = MySQL(cursorclass=DictCursor)

app = Flask(__name__, static_url_path="")
app.secret_key = "bilo sta"

#app.register_blueprint(korisnik_blueprint, url_prefix="/korisnik")

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'transakcija'

mysql_db.init_app(app)


@app.route("/")
def index():
    return app.send_static_file("index.html")



# ---------------------LOGIN/LOGOUT-----------------------------

@app.route("/login", methods=["POST"])
def login():
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT * FROM korisnik WHERE korisnicko_ime=%(korisnicko_ime)s AND lozinka=%(lozinka)s", flask.request.json)
    korisnik = cr.fetchone()
    if korisnik is not None:
        flask.session["korisnik"] = korisnik
        return "", 200

    return "", 401

@app.route("/logout", methods=["GET"])
def logout():
    flask.session.pop("korisnik", None)
    return "", 200

# -------------------------------------------------------------



# ---------------------PRAVNA LICA-----------------------------


@app.route("/pravnaLica", methods=["GET"])
@secured(roles=[1,2])
def dobavljanje_pravnih_lica():
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT * FROM lica WHERE tip='pravno'")
    lica = cr.fetchall()
    return flask.json.jsonify(lica)

@app.route("/pravnaLica", methods=["POST"])
@secured(roles=[1,2])
def dodavanje_pravnog_lica():
    db = mysql_db.get_db()
    cr = db.cursor()
    korisnik = dict(flask.session["korisnik"])
    data = dict(request.json)
    data["korisnik_id"] = korisnik["id"]
    cr.execute("INSERT INTO lica (tip, ime, adresa, PIB, maticni_broj, obrisano, korisnik_id) VALUES(%(tip)s, %(ime)s, %(adresa)s, %(PIB)s, %(maticni_broj)s, %(obrisano)s, %(korisnik_id)s)", data)
    db.commit()
    return "", 201

@app.route("/pravnaLica/<int:id>", methods=["GET"])
@secured(roles=[1,2])
def dobavljanje_jednog_pravnogLica(id):
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT * FROM lica WHERE id=%s", (id, ))
    lice = cr.fetchone()
    return flask.jsonify(lice)

@app.route("/pravnaLica/<int:id>", methods=["PUT"])
@secured(roles=[1])
def izmena_pravnog_lica(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["id"] = id
    cr.execute("UPDATE lica SET ime=%(ime)s, adresa=%(adresa)s, PIB=%(PIB)s, maticni_broj=%(maticni_broj)s, obrisano=%(obrisano)s WHERE id=%(id)s", data)
    db.commit()
    return "", 200

@app.route("/ukloniPravnoLice/<int:id>", methods=["PUT"])
@secured(roles=[1])
def uklanjanje_pravnog_lica(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["obrisano"] = 1
    cr.execute("UPDATE lica SET obrisano=%(obrisano)s WHERE id=%(id)s", data)
    db.commit()
    return "", 204



# -------------------------------------------------------------


# --------------------------RACUNI-----------------------------


@app.route("/racuni/<int:id>", methods=["GET"])
@secured(roles=[1,2])
def dobavljanje_racuna(id):
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT * FROM racuni WHERE lica_id=%s", (id, ))
    racuni = cr.fetchall()
    return flask.json.jsonify(racuni)

@app.route("/racun/<int:id>", methods=["GET"])
@secured(roles=[1,2])
def dobavljanje_jednog_racuna(id):
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT * FROM racuni WHERE id=%s", (id, ))
    racun = cr.fetchone()
    return flask.jsonify(racun)

@app.route("/ukloniRacun/<int:id>", methods=["PUT"])
@secured(roles=[1])
def uklanjanje_racuna(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["obrisano"] = 1
    cr.execute("UPDATE racuni SET obrisano=%(obrisano)s WHERE id=%(id)s", data)
    db.commit()
    return "", 204

@app.route("/noviRacun", methods=["POST"])
@secured(roles=[1,2])
def dodavanje_racuna():
    db = mysql_db.get_db()
    cr = db.cursor()
    cr.execute("INSERT INTO racuni (broj, iznos, lica_id, obrisano) VALUES(%(broj)s, %(iznos)s, %(lica_id)s, %(obrisano)s)", request.json)
    db.commit()
    return "", 201

@app.route("/racun/<int:id>/<int:iznos>", methods=["PUT"])
@secured(roles=[1])
def izmena_racuna(id, iznos):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["iznos"] -= iznos
    cr.execute("UPDATE racuni SET iznos=%(iznos)s WHERE id=%(id)s", data)
    db.commit()
    return "", 204

@app.route("/racun1/<int:id>/<int:iznos>", methods=["PUT"])
@secured(roles=[1])
def izmena_racuna1(id, iznos):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["iznos"] += iznos
    cr.execute("UPDATE racuni SET iznos=%(iznos)s WHERE id=%(id)s", data)
    db.commit()
    return "", 204

@app.route("/ponistiUklanjanjeRacuna/<int:id>", methods=["PUT"])
@secured(roles=[1])
def ponistavanje_uklanjanja_racuna(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["obrisano"] = 0
    cr.execute("UPDATE racuni SET obrisano=%(obrisano)s WHERE id=%(id)s", data)
    db.commit()
    return "", 204


# -------------------------------------------------------------


# ------------------------FIZICKA LICA-------------------------


@app.route("/fizickaLica", methods=["GET"])
@secured(roles=[1,2])
def dobavljanje_fizickih_lica():
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT * FROM lica WHERE tip='fizicko'")
    lica = cr.fetchall()
    return flask.json.jsonify(lica)

@app.route("/fizickaLica", methods=["POST"])
@secured(roles=[1,2])
def dodavanje_fizickog_lica():
    db = mysql_db.get_db()
    cr = db.cursor()
    korisnik = dict(flask.session["korisnik"])
    data = dict(request.json)
    data["korisnik_id"] = korisnik["id"]
    cr.execute("INSERT INTO lica (tip, ime, adresa, maticni_broj, obrisano, korisnik_id) VALUES(%(tip)s, %(ime)s, %(adresa)s, %(maticni_broj)s, %(obrisano)s, %(korisnik_id)s)", data)
    db.commit()
    return "", 201

@app.route("/fizickaLica/<int:id>", methods=["GET"])
@secured(roles=[1,2])
def dobavljanje_jednog_fizickog_lica(id):
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT * FROM lica WHERE id=%s", (id, ))
    lice = cr.fetchone()
    return flask.jsonify(lice)

@app.route("/fizickaLica/<int:id>", methods=["PUT"])
@secured(roles=[1])
def izmena_fizickog_lica(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["id"] = id
    cr.execute("UPDATE lica SET ime=%(ime)s, adresa=%(adresa)s,maticni_broj=%(maticni_broj)s, obrisano=%(obrisano)s WHERE id=%(id)s", data)
    db.commit()
    return "", 200

@app.route("/ukloniFizickoLice/<int:id>", methods=["PUT"])
@secured(roles=[1])
def uklanjanje_fizickog_lica(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["obrisano"] = 1
    cr.execute("UPDATE lica SET obrisano=%(obrisano)s WHERE id=%(id)s", data)
    db.commit()
    return "", 204



# -------------------------------------------------------------



# -----------------------------LICA----------------------------

@app.route("/lica", methods=["GET"])
@secured(roles=[1,2])
def dobavi_lica():
    db = mysql_db.get_db()
    cr = db.cursor()
    cr.execute("SELECT * FROM lica")
    lica = cr.fetchall()
    return flask.jsonify(lica)

@app.route("/lice/<int:id>", methods=["GET"])
@secured(roles=[1,2])
def dobavi_lice(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    cr.execute("SELECT * FROM lica WHERE id=%s", (id, ))
    lice = cr.fetchone()
    return flask.jsonify(lice)

@app.route("/ponistiUklanjanjeLica/<int:id>", methods=["PUT"])
@secured(roles=[1])
def ponistavanje_uklanjanja_lica(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["obrisano"] = 0
    cr.execute("UPDATE lica SET obrisano=%(obrisano)s WHERE id=%(id)s", data)
    db.commit()
    return "", 204


# -------------------------------------------------------------


# -------------------------TRANSAKCIJE-------------------------


@app.route("/transakcije", methods=["GET"])
@secured(roles=[1,2])
def dobavi_transakcije():
    db = mysql_db.get_db()
    cr = db.cursor()
    cr.execute("SELECT * FROM transakcije ORDER BY datum DESC")
    transakcije = cr.fetchall()
    for t in transakcije:
        t["datum"] = t["datum"].isoformat()
    return flask.jsonify(transakcije)

@app.route("/transakcije/<int:id>", methods=["GET"])
@secured(roles=[1,2])
def dobavljanje_jedne_transakcije(id):
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT * FROM transakcije WHERE id=%s", (id, ))
    transakcija = cr.fetchone()
    transakcija["datum"] = transakcija["datum"].isoformat()
    return flask.jsonify(transakcija)

@app.route("/transakcije", methods=["POST"])
@secured(roles=[1])
def dodavanje_transakcije():
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["datum"] = datetime.datetime.now()
    cr.execute("INSERT INTO transakcije (iznos, datum, racuni_id, racuni_id1, obrisano) VALUES(%(iznos)s, %(datum)s, %(racuni_id)s, %(racuni_id1)s, %(obrisano)s)", data)
    db.commit()
    return "", 201

@app.route("/transakcije/<int:id>", methods=["PUT"])
@secured(roles=[1])
def uklanjanje_transakcije(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["obrisano"] = 1
    cr.execute("UPDATE transakcije SET obrisano=%(obrisano)s WHERE id=%(id)s", data)
    db.commit()
    return "", 204

@app.route("/ponistiUklanjanjeTransakcije/<int:id>", methods=["PUT"])
@secured(roles=[1])
def ponistavanje_uklanjanja_transakcije(id):
    db = mysql_db.get_db()
    cr = db.cursor()
    data = dict(request.json)
    data["obrisano"] = 0
    cr.execute("UPDATE transakcije SET obrisano=%(obrisano)s WHERE id=%(id)s", data)
    db.commit()
    return "", 204

def dobavljanje_id_racuna(id):
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT id FROM racuni WHERE lica_id=%s", (id, ))
    racuni = cr.fetchall()
    lista = []
    for r in racuni:
        lista.append(r["id"])
    return lista

# -------------------------------------------------------------

@app.route("/korisnici/<int:id>", methods=["GET"])
@secured(roles=[1,2])
def dobavljanje_korisnika(id):
    cr = mysql_db.get_db().cursor()
    cr.execute("SELECT * FROM korisnik WHERE id=%s", (id, ))
    korisnik = cr.fetchone()
    return flask.json.jsonify(korisnik)

@app.route("/korisnik", methods=["GET"])
@secured(roles=[1,2])
def dobavljanje_ulogovanog_korisnika():
    ulogovani_korisnik = flask.session["korisnik"]
    return flask.jsonify(ulogovani_korisnik)

if __name__ == "__main__":
    app.run("0.0.0.0", 5000, threaded=True)
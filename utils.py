import flask
from flaskext.mysql import MySQL 
from pymysql.cursors import DictCursor
from functools import wraps

mysql_db = MySQL(cursorclass=DictCursor)

def secured(roles=[]):
    def secured_with_roles(f):
        @wraps(f)
        def login_check(*args, **kwargs):
            if flask.session.get("korisnik") is not None and flask.session.get("korisnik")["pravo_id"] in roles:
                return f(*args, **kwargs)
            return "", 401
        return login_check
    return secured_with_roles

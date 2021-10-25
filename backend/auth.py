from database import connect
import hashlib

def verifyLogin(user,pasw):
    pasw = hashlib.sha1(pasw.encode()).hexdigest()
    db = connect()
    cursor = db.cursor()
    cursor.execute(f"select * from USUARIO where user like '{user}' and password like '{pasw}'")
    data = cursor.fetchone()
    cursor.close()
    if(data is None):
        return False, 0
    return True, data
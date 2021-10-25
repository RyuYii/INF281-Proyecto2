from database import connect
import pandas as pd
import json
import hashlib

from re import sub

def camel_case(s):
  s = sub(r"(_|-)+", " ", s).title().replace(" ", "")
  return ''.join([s[0].lower(), s[1:]])

def select(query):
    db = connect()
    cursor = db.cursor()
    cursor.execute(query)   
    index = cursor.description
    row = list()
    for i in range(len(index)):
        row.append(camel_case(index[i][0]))
        # Obtener información de devolución
    data = cursor.fetchall()
    cursor.close()
    result = pd.DataFrame(list(data), columns=row)
    js = result.to_json(orient = 'records',date_format='iso',compression='gzip')
            #Cerrar conexión, liberar recursos
    cursor.close()
    db.commit()
    return json.loads(js)

def insert(query):
    db = connect()
    cursor = db.cursor()
    try:
        cursor.execute(query)
        return {"code":1, "message":"registro correcto"}
    except Exception as e:
        return {"code":0, "message": f"algo salio mal: {e}"}

class Querys:
    def obtenerRol(idUser):
        q = f"""
            select ROL.id_rol, ROL.descripcion, USUARIO.user from TIENE 
            left join ROL on ROL.id_rol = TIENE.id_rol
            left join USUARIO on USUARIO.id_usuario = TIENE.id_usuario
            where TIENE.id_usuario = {idUser}
        """
        data = select(q)
        #if len(data) == 0:
            #return {""}
        return data
    
    def signIn(data):
        pasw = data['password']
        pasw = hashlib.sha1(pasw.encode()).hexdigest()
        query = ''
        return insert(query)

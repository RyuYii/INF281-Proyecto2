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
        db.commit()
        cursor.close()
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
        query = f"""
            select * from USUARIO where ci = '{data['ci']}'
        """
        step = select(query)
        if len(step) > 0:
            return {"code":0, "message": "Un usuario tiene el mismo ci"}

        query = f"""
            insert into PERSONA (ci, fecha_nac, nombre, apellido) values ('{data['ci']}','{data['fechaNac']}', '{data['nombres']}','{data['apellidos']}')
        """
        step = insert(query)
        if step['code'] == 0:
            return step
        pasw = data['password']
        pasw = hashlib.sha1(pasw.encode()).hexdigest()

        query = f"""
            insert into USUARIO (user, password, ci) VALUES ('{data['username']}','{pasw}','{data['ci']}')
        """
        step = insert(query)
        if step['code'] == 0:
            return step

        query = f"""
            select id_usuario from USUARIO where ci = '{data['ci']}'
        """
        step = select(query)

        query = f"""
            insert into TIENE (id_usuario, id_rol) VALUES ({step[0]['idUsuario']}, {1})
        """
        return insert(query)

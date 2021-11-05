import pymysql
import pandas as pd
import json

from re import sub

db = pymysql.connect(host="remotemysql.com", user="Y7DvxDWOX0", password="RQF76rdgnI", database="Y7DvxDWOX0")

def camel_case(s):
  s = sub(r"(_|-)+", " ", s).title().replace(" ", "")
  return ''.join([s[0].lower(), s[1:]])

def select(query):
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
  return json.loads(js)

def insert(query):
    cursor = db.cursor()
    try:
        cursor.execute(query)
        db.commit()
        cursor.close()
        return {"code":1, "message":"registro correcto"}
    except Exception as e:
        return {"code":0, "message": f"algo salio mal: {e}"}

#insert into PERSONA (ci, fecha_nac, nombre, apellido) values ('123','2021-10-01', 'test','test')
# insert into USUARIO (user, password, ci) VALUES ('admin','d033e22ae348aeb5660fc2140aec35850c4da997','123')
# qr = """
# insert into PERSONA (ci, fecha_nac, nombre, apellido) values ('123','2021-10-01', 'test','test')
# """
# print(insert(qr))
# qr = """
# insert into USUARIO (user, password, ci) VALUES ('admin','d033e22ae348aeb5660fc2140aec35850c4da997','123')
# """
# print(insert(qr))
# 0MayvIs75Vl6v27

"""
INSERT INTO PROYECTO(
  titulo_proy, mision, 
  vision, objetivos, id_usuario, 
  fecha_inicio, fecha_cierre, 
  banner, tipo_proy, identifier) 
VALUES (
  'titulo', 'mision',
  'vision','objetivo', 12,
  null, null,
  null, 1, '0MayvIs75Vl6v27')
"""


qr = f"""
INSERT INTO PATROCINADOR( nombre_p, tipo_patrocinador) VALUES ('pepsi','comercial')
"""
#x = select(qr)[0]['password'] print(''.join(random.choice(string.ascii_letters + 5) for _ in range(8)))
print(insert(qr))

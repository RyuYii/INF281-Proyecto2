import pymysql
import pandas as pd
import json

from re import sub

db = pymysql.connect(host="remotemysql.com", user="Y7DvxDWOX0", password="RQF76rdgnI", database="Y7DvxDWOX0")

def camel_case(s):
  s = sub(r"(_|-)+", " ", s).title().replace(" ", "")
  return ''.join([s[0].lower(), s[1:]])


cursor = db.cursor()
cursor.execute("""
    select PERSONA.ci, PERSONA.nombre, PERSONA.apellido from USUARIO 
    LEFT JOIN PERSONA ON USUARIO.ci = PERSONA.ci
    where USUARIO.id_usuario = 10
    """)
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
print(json.loads(js))

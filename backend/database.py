import pymysql

############### CONFIGURAR ESTO ###################
# Abre conexion con la base de datos
# db = pymysql.connect("database_host","username","password","database_name")
db = pymysql.connect(host="remotemysql.com", user="Y7DvxDWOX0", password="RQF76rdgnI", database="Y7DvxDWOX0")
##################################################

def connect():
    return pymysql.connect(host="remotemysql.com", user="Y7DvxDWOX0", password="RQF76rdgnI", database="Y7DvxDWOX0")
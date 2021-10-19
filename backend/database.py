import pymysql

############### CONFIGURAR ESTO ###################
# Abre conexion con la base de datos
# db = pymysql.connect("database_host","username","password","database_name")
db = pymysql.connect(host="remotemysql.com", user="Y7DvxDWOX0", password="RQF76rdgnI", database="Y7DvxDWOX0")
##################################################

# # prepare a cursor object using cursor() method
# cursor = db.cursor()

# # ejecuta el SQL query usando el metodo execute().
# cursor.execute("SELECT VERSION()")

# # procesa una unica linea usando el metodo fetchone().
# data = cursor.fetchone()
# print ("Database version : {0}".format(data))

# # desconecta del servidor
# db.close()
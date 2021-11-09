from database import connect
import pandas as pd
import json
import hashlib
import string
import random

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

    def obtenerDatosPersonales(data):
        query = f"""
            select PERSONA.* from USUARIO
            LEFT JOIN PERSONA ON PERSONA.ci = USUARIO.ci
            where id_usuario = {data['idUsuario']}
        """
        return select(query)

    def changePassword(data):
        pasw = hashlib.sha1(data['password'].encode()).hexdigest()
        newpasw = hashlib.sha1(data['newpassword'].encode()).hexdigest()
        user = data['idUsuario']
        query = f"""
            select password from USUARIO where id_usuario = {user}
        """
        step = select(query)
        if len(step) == 0:
            return {"code":0, "message": "Ocurrio un error, el usuario no es el correcto"}

        x = step[0]['password']
        if x == pasw:
            query = f"""
                update USUARIO set password = '{newpasw}'
                where id_usuario={user}
            """
            return insert(query)
        else:
            return {"code":0, "message": "La contraseña no es la correcta, vuelva a intentarlo"}

    def changeDatosPersonales(data):
        fecha = f"'{data['fechaNac']}'" if not data['fechaNac'] is None else 'null'
        query = f"""
            update PERSONA set
                nombre = '{data['nombres']}',
                apellido = '{data['apellidos']}',
                fecha_nac = {fecha}
            where ci = '{data['ci']}'
        """
        return insert(query)


    def obtenerSolicitudes():
        query = """
        select PERSONA.*, SOLICITUD.* from SOLICITUD 
        left join USUARIO on SOLICITUD.id_usuario = USUARIO.id_usuario
        left join PERSONA on PERSONA.ci = USUARIO.ci
        where SOLICITUD.estado = 1
        """
        return select(query)

    def registrarSolicitud(data):
        user = data["idUsuario"]
        motivo = data["motivo"]
        query = f"""
        select * from SOLICITUD where id_usuario = {user} and estado = 1
        """
        if len(select(query)) != 0:
            return {"code":0, "message": "La solicitud ya fue registrada, Podra enviar otra solicitud si fue rechazada la solicitud actual"}
        
        query = f"""
        INSERT INTO SOLICITUD(id_usuario, motivo, fec_reg, estado) VALUES ({user},'{motivo}',CURRENT_DATE,1)
        """
        return insert(query)

    def aceptarSolicitud(data):
        user = data["idUsuario"]
        query = f"""
            update SOLICITUD 
            set estado = 0
            where id_usuario = {user}
        """
        step = insert(query)
        if step['code'] == 0:
            return step
        query = f"""
            update TIENE
            set id_rol = 2
            where id_usuario = {user}
        """
        return insert(query)



        
    #proyectos estado 1: solicitud 2:aceptados 3:rechazados
    def obtenerProyectosEnEspera():
        query = """
            select FASE_PROYECTO.id_fase, PROYECTO.*, PERSONA.* from FASE_PROYECTO
            left join PROYECTO on PROYECTO.id_proy = FASE_PROYECTO.id_proy
            left join USUARIO on USUARIO.id_usuario = FASE_PROYECTO.id_usuario
            left join PERSONA on PERSONA.ci = USUARIO.ci
            where FASE_PROYECTO.estado = 1
        """
        return select(query)

    def obtenerProyectosRegistrados(data):
        user = data["idUsuario"]
        query = ''
        if user == 0:
            query = """
                select FASE_PROYECTO.id_fase, PROYECTO.*, PERSONA.* from FASE_PROYECTO
                left join PROYECTO on PROYECTO.id_proy = FASE_PROYECTO.id_proy
                left join USUARIO on USUARIO.id_usuario = FASE_PROYECTO.id_usuario
                left join PERSONA on PERSONA.ci = USUARIO.ci
                where FASE_PROYECTO.estado = 3
            """
        else:
            query = f"""
                select FASE_PROYECTO.id_fase, PROYECTO.*, PERSONA.* from FASE_PROYECTO
                left join PROYECTO on PROYECTO.id_proy = FASE_PROYECTO.id_proy
                left join USUARIO on USUARIO.id_usuario = FASE_PROYECTO.id_usuario
                left join PERSONA on PERSONA.ci = USUARIO.ci
                where FASE_PROYECTO.id_usuario= {user}
            """
        return select(query)

    def obtenerProyecto(data):
        idProy = data["idProy"]
        query = f"""
            select * 
            from PROYECTO 
            where id_proy = {idProy}
        """
        return select(query)

    def registrarProyecto(data):
        listado = data['listado']
        tipo = data['tipo']
        ident = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(15))
        query = f"""
            INSERT INTO PROYECTO(
                titulo_proy, mision, 
                vision, objetivos, id_usuario, 
                fecha_inicio, fecha_cierre, 
                banner, tipo_proy, identifier) 
            VALUES (
                '{data["titulo"]}', '{data["mision"]}',
                '{data["vision"]}','{data["objetivo"]}', {data["idUsuario"]},
                {f"'{data['fechaInicio']}'" if not data['fechaInicio'] is None else 'null'}, 
                {f"'{data['fechaFinal']}'" if not data['fechaFinal'] is None else 'null'},
                '{data["banner"]}', {data["tipo"]}, '{ident}')
        """
        step = insert(query)
        if step['code'] == 0:
            return step
        #obtenemos el id_proy generado
        query = f"""
            select id_proy from PROYECTO where identifier = '{ident}'
        """
        step = select(query)
        idProy = step[0]["idProy"]
        #preparamos la fase del proyecto
        query = f"""
        INSERT INTO FASE_PROYECTO(
            estado, fecha_valoracion, 
            id_proy, id_usuario) 
        VALUES (
            1 , current_date,
            {idProy}, {data["idUsuario"]}
        )
        """
        step = insert(query)
        if step['code'] == 0:
            return step

        #almacenamos los patrocinadores

        return {"code":1, "message":"registro exitoso", "idProy":f"{idProy}"}

    def eliminarProyecto(data):
        query = f"""
            DELETE FROM PROYECTO WHERE id_proy = {data["idProy"]}
        """
        #completar, se tienen que borrar todo lo relacionado con el proyecto
        return insert(query)

    #actividades works
    def obtenerActividades(data):
        query = f"""
            select * from ACTIVIDAD WHERE id_proy = {data["idProy"]}
        """
        return select(query)

    def editarActividad(data):
        idActividad = data["idActividad"]
        if idActividad is None:
            query = f"""
                INSERT INTO ACTIVIDAD(
                    nombre_actividad, 
                    descripcion, horario, id_proy) 
                VALUES (
                    '{data["title"]}',
                    '{data["desc"]}',
                    '{data["horario"]}',
                    {data["idProy"]}
                )
            """
        else:
            query = f"""
                update ACTIVIDAD  
                set 
                    nombre_actividad = '{data["title"]}', 
                    descripcion ='{data["desc"]}', 
                    horario ='{data["horario"]}'
                where
                    id_actividad = {idActividad}
            """
        return insert(query)

    def eliminarActividad(data):
        query = f"""
            DELETE FROM ACTIVIDAD WHERE id_actividad = {data["idActividad"]}
        """
        return insert(query)
    
    #productos works
    def obtenerProductos(data):
        query = f"""
            select * from CATALOGO WHERE id_proy = {data["idProy"]}
        """
        return select(query)

    def editarProductos(data):
        idCat = data["idCat"]
        if idCat is None:
            query = f"""
                INSERT INTO CATALOGO(
                    nombre_prod, 
                    descripcion, precio, id_proy) 
                VALUES (
                    '{data["title"]}',
                    '{data["desc"]}',
                    {data["precio"]},
                    {data["idProy"]}
                )
            """
        else:
            query = f"""
                update CATALOGO 
                set nombre_prod = '{data["title"]}', 
                    descripcion = '{data["desc"]}', 
                    precio = {data["precio"]}
                where id_cat = {idCat}

            """
        return insert(query)

    def eliminarProducto(data):
        query = f"""
            DELETE FROM CATALOGO WHERE id_cat={data["idCat"]}
        """
        return insert(query)

    def obtenerPatrocinadores(data):
        idPat = data["idPat"]
        query = f"""
            select * 
            from PATROCINADOR
            where id_patrocinador = {idPat}
        """
        return select(query)

    def registrarPatrocinador(data):
        nombreP = data["nombreP"]
        tipoPatrocinador = data["tipoPatrocinador"]
        query = f"""
            INSERT INTO 
            PATROCINADOR( nombre_p, tipo_patrocinador) 
            VALUES ('{nombreP}','{tipoPatrocinador}')
        """
        return insert(query)

    #Eliminar Patrocinador por id_patrocinador
    def eliminarPatrocinador(data):
        idPat = data["idPat"]
        query = f"""
            delete 
            from PATROCINADOR
            where id_patrocinador = {idPat}
        """
        return insert(query)

    def registrarComentario(data):
        query = f"""
            INSERT INTO COMENTARIO(
                comentario, 
                id_proy, 
                id_usuario, 
                fecha_comentario) 
            VALUES (
                '{data["comentario"]}',
                {data["idProy"]},
                {data["idUsuario"]},
                current_date
            )
        """
        return insert(query)

    def eliminarComentario(data):
        query = f"""
            DELETE FROM COMENTARIO WHERE id_comentario={data["idComentario"]}
        """
        return insert(query)

    def listarComentariosProyecto(data):
        query = f"""
            select COMENTARIO.*, PERSONA.* from COMENTARIO
            LEFT JOIN USUARIO ON COMENTARIO.id_usuario = USUARIO.id_usuario
            LEFT JOIN PERSONA ON PERSONA.ci = USUARIO.ci 
            where id_proy = {data["idProy"]}
        """
        return select(query)
    
    #listado para el superUsuario
    def listarComentarios():
        query = f"""
            select COMENTARIO.*, PERSONA.* from COMENTARIO
            LEFT JOIN USUARIO ON COMENTARIO.id_usuario = USUARIO.id_usuario
            LEFT JOIN PERSONA ON PERSONA.ci = USUARIO.ci
            order by COMENTARIO.id_proy
        """
        return select(query)

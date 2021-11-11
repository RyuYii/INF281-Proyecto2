API = "/api/"

class Routes:
    index = API
    login = API+"login"
    logout = API+"logout"
    protected = API+"protected"
    
    obtenerRol = API+"obtenerRol"
    signin = API+"signin"
    obtenerDatosPersonales = API+"datosPersonales"
    changeDatosPersonales = API+"changeDatosPersonales"
    changePassword = API+"changePassword"

    #realizar
    obtenerSolicitudes = API+"obtenerSolicitudes"
    registrarSolicitud  = API+"registrarSolicitud"
    aceptarSolicitud = API+"aceptarSolicitud"

    obtenerProyectosEnEspera = API+"obtenerProyectosEnEspera" #pensar
    obtenerProyectosRegistrados = API+"obtenerProyectosRegistrados" #parametro null devuelve todos los publicados
    obtenerProyecto  = API+"obtenerProyecto"
    registrarProyecto = API+"registrarProyecto"
    eliminarProyecto = API+"eliminarProyecto"
    editarProyecto = API+"editarProyecto"
    valorarProyecto = API+"valorarProyecto"

    obtenerActividades = API+"obtenerActividades"
    editarActividad = API+"editarActividad"
    eliminarActividad = API+"eliminarActividad"

    obtenerProductos = API+"obtenerProductos"
    editarProductos = API+"editarProductos"
    eliminarProducto = API+"eliminarProducto"

    obtenerPatrocinadores = API+"obtenerPatrocinadores"
    registrarPatrocinador  = API+"registrarPatrocinador"
    eliminarPatrocinador = API+"eliminarPatrocinador"

    registrarComentario = API+"registrarComentario"
    eliminarComentario = API+"eliminarComentario"
    listarComentariosProyecto = API+"listarComentariosProyecto"
    listarComentarios = API+"listarComentarios"

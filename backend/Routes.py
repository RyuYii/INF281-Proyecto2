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
    obtenerEstadoSolicitud = API+"obtenerEstadoSolicitud"
    registrarSolicitud  = API+"registrarSolicitud"

    obtenerFaseProyecto = API+"obtenerFaseProyecto" #pensar
    obtenerProyectosRegistrados = API+"obtenerProyectosRegistrados" #parametro null devuelve todos los publicados
    obtenerProyecto  = API+"obtenerProyecto"
    registrarProyecto = API+"registrarProyecto"
    eliminarProyecto = API+"eliminarProyecto"

    obtenerActividades = API+"obtenerActividades"
    editarActividad = API+"editarActividad"
    eliminarActividad = API+"eliminarActividad"

    obtenerProductos = API+"obtenerProductos"
    editarProductos = API+"editarProductos"
    eliminarProducto = API+"eliminarProducto"

    obtenerPatrocinadores = API+"obtenerPatrocinadores"
    registrarPatrocinador  = API+"registrarPatrocinador"
    eliminarPatrocinador = API+"eliminarPatrocinador"

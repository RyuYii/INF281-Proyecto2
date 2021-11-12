import traceback
import json
from ModelJwt import createToken, revokeToken, getToken
from flask_restful import Resource, reqparse
from datetime import datetime, timedelta
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt, get_jti)
from flask import session, jsonify, current_app as app
from http import HTTPStatus
from Configuration import Configuration
from Responses import clientResponses as messages, messageToken, addNextRoute
from auth import verifyLogin
from Routes import Routes
from Querys import Querys

expiresMinutes = Configuration.TOKEN_MINUTES_LIFE

# def havePermission(username, permission=None):
#   listResult = User(username=username, permission=permission).searchActiveUserPermission()
#   return listResult != [], listResult


parser = reqparse.RequestParser()
parser.add_argument('username', type=str, help = 'This field cannot be blank', required = True)
parser.add_argument('password', type=str, help = 'This field cannot be blank', required = True)
# parser.add_argument('g-recaptcha-response', type=str, help = 'This field cannot be blank', required = (not Configuration.DEBUG)) #requerido cuando no es debug
class Login(Resource):
  def post(self):
    data = parser.parse_args()
    verify, user = verifyLogin(data["username"], data["password"])
    if verify == True:
      expires = timedelta(days=expiresMinutes)
      access_token = create_access_token(identity = user[0], expires_delta=expires)
      expiresTime = datetime.today() + expires
      return messageToken(access_token, str(expiresTime), Routes.protected)
    else:
      return messages.adminLoginError, HTTPStatus.UNAUTHORIZED


parserSI = reqparse.RequestParser()
parserSI.add_argument('username', type=str, help = 'This field cannot be blank', required = True)
parserSI.add_argument('password', type=str, help = 'This field cannot be blank', required = True)
parserSI.add_argument('nombres', type=str, help = 'This field cannot be blank', required = True)
parserSI.add_argument('ci', type=str, help = 'This field cannot be blank', required = True)
parserSI.add_argument('apellidos', type=str, help = 'This field cannot be blank', required = True)
parserSI.add_argument('fechaNac', type=str, help = 'This field cannot be blank')
class SignIn(Resource):
  def post(self):
    data = parserSI.parse_args()
    return Querys.signIn(data)

class Index(Resource):
  def get(self):
    return messages.index

parserOR = reqparse.RequestParser()
parserOR.add_argument('idUser', type=int, help = 'This field cannot be blank', required = True)
class ObtenerRol(Resource):
  @jwt_required
  def post(self):
    data = parserOR.parse_args()
    return Querys.obtenerRol(data["idUser"])

parserODP = reqparse.RequestParser()
parserODP.add_argument('idUsuario', type=int, help = 'This field cannot be blank', required = True)
class ObtenerDatosPersonales(Resource):
  @jwt_required
  def post(self):
    data = parserODP.parse_args()
    return Querys.obtenerDatosPersonales(data)

parserCDP = reqparse.RequestParser()
parserCDP.add_argument('nombres', type=str, help = 'This field cannot be blank', required = True)
parserCDP.add_argument('ci', type=str, help = 'This field cannot be blank', required = True)
parserCDP.add_argument('apellidos', type=str, help = 'This field cannot be blank', required = True)
parserCDP.add_argument('fechaNac', type=str, help = 'This field cannot be blank')
class ChangeDatosPersonales(Resource):
  @jwt_required
  def post(self):
    data = parserCDP.parse_args()
    return Querys.changeDatosPersonales(data)


parserCP = reqparse.RequestParser()
parserCP.add_argument('idUsuario', type=str, help = 'This field cannot be blank', required = True)
parserCP.add_argument('password', type=str, help = 'This field cannot be blank', required = True)
parserCP.add_argument('newpassword', type=str, help = 'This field cannot be blank')
class ChangePassword(Resource):
  @jwt_required
  def post(self):
    data = parserCP.parse_args()
    return Querys.changePassword(data)

class Protected(Resource):
  @jwt_required
  def get(self):
      return {"hola": "hola usuario logeado"}

#algun dia lo conseguire hacer funcionar...  
class UserLogoutAccess(Resource):
  @jwt_required
  def post(self):
    jti = get_raw_jwt()['jti']
    try:
      # revoked_store.set(jti, "true", keepttl=True)
      revokeToken(jti)
      session.clear()
      return addNextRoute(messages.userLogout, Routes.index)
    except:
      traceback.print_exc()
      app.logger.error("Error", exc_info=1)
      return messages.defaultError   
#pensar
class ObtenerSolicitudes(Resource):
  @jwt_required
  def get(self):
    return Querys.obtenerSolicitudes()

parserRS = reqparse.RequestParser()
parserRS.add_argument('idUsuario', type=str, help = 'This field cannot be blank', required = True)
parserRS.add_argument('motivo', type=str, help = 'This field cannot be blank', required = True)
class RegistrarSolicitud (Resource):
  @jwt_required
  def post(self):
    data = parserRS.parse_args()
    return Querys.registrarSolicitud(data)

parseAS = reqparse.RequestParser()
parseAS.add_argument('idUsuario', type=str, help = 'This field cannot be blank', required = True)
class AceptarSolicitud(Resource):
  @jwt_required
  def post(self):
    data = parseAS.parse_args()
    return Querys.aceptarSolicitud(data)
    
#parserOFP = reqparse.RequestParser()
#parserOFP.add_argument('idProy', type=str, help = 'This field cannot be blank', required = True)
class ObtenerProyectosEnEspera(Resource): #pensar
  @jwt_required
  def get(self):
    #data = parserOFP.parse_args()
    return Querys.obtenerProyectosEnEspera()
    
parserOPR = reqparse.RequestParser()
parserOPR.add_argument('idUsuario', type=int)
class ObtenerProyectosRegistrados(Resource): #parametro null devuelve todos los publicados
  @jwt_required
  def post(self):
    data = parserOPR.parse_args()
    return Querys.obtenerProyectosRegistrados(data)
  def get(self):
    return Querys.obtenerProyectosRegistrados({"idUsuario":0})
    
parserOP = reqparse.RequestParser()
parserOP.add_argument('idProy', type=int, help = 'This field cannot be blank', required = True)
class ObtenerProyecto (Resource):
  def post(self):
    data = parserOP.parse_args()
    return Querys.obtenerProyecto(data)

parserRProy = reqparse.RequestParser()
parserRProy.add_argument('tipo')
parserRProy.add_argument('banner')
parserRProy.add_argument('fechaFinal')
parserRProy.add_argument('fechaInicio')
parserRProy.add_argument('titulo')
parserRProy.add_argument('objetivo')
parserRProy.add_argument('mision')
parserRProy.add_argument('vision')
parserRProy.add_argument('listado', type=dict)
parserRProy.add_argument('idUsuario')
parserRProy.add_argument('descripcionProy')
class RegistrarProyecto(Resource):
  @jwt_required
  def post(self):
    data = parserRProy.parse_args()
    #print(data["listado"]["list"])
    return Querys.registrarProyecto(data)

parserEdProy = reqparse.RequestParser()
parserEdProy.add_argument('fechaFinal')
parserEdProy.add_argument('fechaInicio')
parserEdProy.add_argument('titulo')
parserEdProy.add_argument('objetivo')
parserEdProy.add_argument('mision')
parserEdProy.add_argument('vision')
parserEdProy.add_argument('idProy')
parserEdProy.add_argument('descripcionProy')
class EditarProyecto(Resource):
  @jwt_required
  def post(self):
    data = parserEdProy.parse_args()
    return Querys.editarProyecto(data)

parserVaProy = reqparse.RequestParser()
parserVaProy.add_argument('idProy')
parserVaProy.add_argument('nota')
class ValorarProyecto(Resource):
  @jwt_required
  def post(self):
    data = parserVaProy.parse_args()
    return Querys.valorarProyecto(data)

parserEProy = reqparse.RequestParser()
parserEProy.add_argument('idProy')
class EliminarProyecto(Resource):
  @jwt_required
  def post(self):
    data = parserEProy.parse_args()
    return Querys.eliminarProyecto(data)

parserAcO = reqparse.RequestParser()
parserAcO.add_argument("idProy",type=int)
class ObtenerActividades(Resource):
  def post(self):
    data = parserAcO.parse_args()
    return Querys.obtenerActividades(data)

parserAcE = reqparse.RequestParser()
parserAcE.add_argument("title",type=str)
parserAcE.add_argument("desc",type=str)
parserAcE.add_argument("horario",type=str)
parserAcE.add_argument("idActividad",type=int)
parserAcE.add_argument("idProy",type=int)
class EditarActividad(Resource):
  @jwt_required
  def post(self):
    data = parserAcE.parse_args()
    return Querys.editarActividad(data)

parserAcEl = reqparse.RequestParser()
parserAcEl.add_argument("idActividad",type=int) 
class EliminarActividad(Resource):
  @jwt_required
  def post(self):
    data = parserAcEl.parse_args()
    return Querys.eliminarActividad(data)

parserProO = reqparse.RequestParser()
parserProO.add_argument("idProy",type=int)
class ObtenerProductos(Resource):
  def post(self):
    data = parserProO.parse_args()
    return Querys.obtenerProductos(data)

parserProE = reqparse.RequestParser()
parserProE.add_argument("title",type=str)
parserProE.add_argument("desc",type=str)
parserProE.add_argument("precio",type=float)
parserProE.add_argument("idCat",type=int)
parserProE.add_argument("idProy",type=int)
class EditarProductos(Resource):
  @jwt_required
  def post(self):
    data = parserProE.parse_args()
    return Querys.editarProductos(data)

parserProEl = reqparse.RequestParser()
parserProEl.add_argument("idCat",type=int) 
class EliminarProducto(Resource):
  @jwt_required
  def post(self):
    data = parserProEl.parse_args()
    return Querys.eliminarProducto(data)


parserOPaT = reqparse.RequestParser()
parserOPaT.add_argument("idProy",type=int)
class ObtenerPatrocinadores(Resource):
  def get(self):
    return Querys.obtenerPatrocinadores(None)
  def post(self):
    data = parserOPaT.parse_args()
    return Querys.obtenerPatrocinadores(data)




parserRP = reqparse.RequestParser()
parserRP.add_argument('nombreP', type=str, help = 'This field cannot be blank', required = True)
parserRP.add_argument('tipoPatrocinador', type=str, help = 'This field cannot be blank', required = True)
class RegistrarPatrocinador (Resource):
  @jwt_required
  def post(self):
    data = parserRP.parse_args()
    return Querys.registrarPatrocinador(data)

parserEP = reqparse.RequestParser()
parserEP.add_argument('idProy', type=str, help = 'This field cannot be blank', required = True)
class EliminarPatrocinador(Resource):
  @jwt_required
  def post(self):
    data = parserEP.parse_args()
    return Querys.eliminarPatrocinador(data)

class EliminarPatrocinador(Resource):
  @jwt_required
  def post(self):
    pass

parserRCom = reqparse.RequestParser()
parserRCom.add_argument("comentario",type=str)
parserRCom.add_argument("idUsuario",type=int)
parserRCom.add_argument("idProy",type=int)
class RegistrarComentario(Resource):
  @jwt_required
  def post(self):
    data = parserRCom.parse_args()
    return Querys.registrarComentario(data)

parserECom = reqparse.RequestParser()
parserECom.add_argument("idComentario",type=int)
class EliminarComentario(Resource):
  @jwt_required
  def post(self):
    data = parserECom.parse_args()
    return Querys.eliminarComentario(data)

parserLComP = reqparse.RequestParser()
parserLComP.add_argument("idProy",type=int)
class ListarComentariosProyecto(Resource):
  def post(self):
    data = parserLComP.parse_args()
    return Querys.listarComentariosProyecto(data)

class ListarComentarios(Resource):
  @jwt_required
  def get(self):
    return Querys.listarComentarios()

   

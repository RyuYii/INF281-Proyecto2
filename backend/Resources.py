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
    
parserOP = reqparse.RequestParser()
parserOP.add_argument('idProy', type=str, help = 'This field cannot be blank', required = True)
class ObtenerProyecto (Resource):
  @jwt_required
  def post(self):
    data = parserOP.parse_args()
    return Querys.obtenerProyecto(data)

class RegistrarProyecto(Resource):
  @jwt_required
  def post(self):
    pass
class EliminarProyecto(Resource):
  @jwt_required
  def post(self):
    pass

class ObtenerActividades(Resource):
  @jwt_required
  def post(self):
    pass
class EditarActividad(Resource):
  @jwt_required
  def post(self):
    pass
class EliminarActividad(Resource):
  @jwt_required
  def post(self):
    pass

class ObtenerProductos(Resource):
  @jwt_required
  def post(self):
    pass
class EditarProductos(Resource):
  @jwt_required
  def post(self):
    pass
class EliminarProducto(Resource):
  @jwt_required
  def post(self):
    pass

class ObtenerPatrocinadores(Resource):
  @jwt_required
  def post(self):
    pass

parserRP = reqparse.RequestParser()
parserRP.add_argument('nombreP', type=str, help = 'This field cannot be blank', required = True)
parserRP.add_argument('tipoPatrocinador', type=str, help = 'This field cannot be blank', required = True)
class RegistrarPatrocinador (Resource):
  @jwt_required
  def post(self):
    data = parserRP.parse_args()
    return Querys.registrarPatrocinador(data)

class EliminarPatrocinador(Resource):
  @jwt_required
  def post(self):
    pass
   

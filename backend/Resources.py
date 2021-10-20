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
    verify = verifyLogin(data["username"], data["password"])
    if verify == True:
      # Verificar que tiene permisos de admin
    #   canAccess, permissions = havePermission(username=data["username"])
    #   if canAccess == False: # Verificar que tiene permisos de admin
    #     return messages.adminNotFound, HTTPStatus.FORBIDDEN
      expires = timedelta(minutes=expiresMinutes)
      access_token = create_access_token(identity = data["username"], expires_delta=expires)
      # revoked_store.set(get_jti(access_token), "false", expires * 1.2)
    #   createToken(get_jti(access_token),False,expires * 1.2)
      expiresTime = datetime.today() + expires
      return messageToken(access_token, str(expiresTime), Routes.protected)
    else:
      return messages.adminLoginError, HTTPStatus.UNAUTHORIZED



class Index(Resource):
  def get(self):
    return messages.index

class Protected(Resource):
    @jwt_required
    def get(self):
        return {"hola": "hola usuario logeado"}
    
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

from flask import Flask, session
from flask_restful import Api
from flask_session import Session
from flask_jwt_extended import JWTManager, create_access_token, exceptions, jwt_required, get_jwt_identity
from Configuration import Configuration
from Routes import Routes
from flask import jsonify
from flask_cors import CORS

from logging.handlers import RotatingFileHandler
import logging
import Resources as resources
import traceback


# logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG)
LOG_FILENAME = 'aplication.log'
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
handler = RotatingFileHandler(LOG_FILENAME, maxBytes=40000000, backupCount=40)
logger.addHandler(handler)

app = Flask(__name__)

CORS(app) # This will enable CORS for all routes
errors = {
  'InternalError': {
      'message': "Internal Error. Wait few Minutes or Contact the Administrator",
      'status': 500,
  },
  'NotFound': {
      'message': "Resource Not Found",
      'status': 404
  },
}
api = Api(app,errors=errors)


app.secret_key = Configuration.JWT_SECRET_KEY
app.config['JWT_SECRET_KEY'] = Configuration.JWT_SECRET_KEY
app.config['PROPAGATE_EXCEPTIONS'] = True
jwt = JWTManager(app)

api.add_resource(resources.Index, Routes.index)
api.add_resource(resources.Login, Routes.login)    
api.add_resource(resources.SignIn, Routes.signin)
api.add_resource(resources.ObtenerDatosPersonales, Routes.obtenerDatosPersonales)
api.add_resource(resources.Protected, Routes.protected)    
api.add_resource(resources.UserLogoutAccess, Routes.logout)
api.add_resource(resources.ObtenerRol, Routes.obtenerRol)


@jwt.expired_token_loader
def my_expired_token_callback(expired_token):
	token_type = expired_token['type']
	session.clear()
	return {
  'code': 0,
  'message': 'The {} token has expired'.format(token_type)
	}, 401

@jwt.revoked_token_loader
def my_revoked_token_callback():
	session.clear()
	return {
  'code': 0,
  'message': 'The token has revoked'
	}, 401

@jwt.unauthorized_loader
def my_unauthorized_token_callback(unauth):
	return {
  'code': 0,
  'message': 'Token is required'
	}, 401

@jwt.invalid_token_loader
def my_invalid_token_callback(invalid):
	return {
		'code': 0,
		'message': 'Token is invalid'
	}, 422

# if __name__ == '__main__':
# 	# import os
app.run(host='127.0.0.1',port=9999,debug=True)
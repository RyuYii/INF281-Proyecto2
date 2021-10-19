from flask import Flask, session
from flask_restful import Api
from flask_session import Session
from flask_jwt_extended import JWTManager, create_access_token, exceptions, jwt_required, get_jwt_identity
from  Configuration import Configuration
from Routes import Routes
from flask import jsonify

from logging.handlers import RotatingFileHandler
import logging
import Resources as resources
import traceback
import requests as request


# logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG)
LOG_FILENAME = 'aplication.log'
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
handler = RotatingFileHandler(LOG_FILENAME, maxBytes=40000000, backupCount=40)
logger.addHandler(handler)

app = Flask(__name__)
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

# app.config['JWT_BLACKLIST_ENABLED'] = True
# app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']


# @jwt.token_in_blacklist_loader
# def check_if_token_in_blacklist(decrypted_token):
# 	jti = decrypted_token['jti']
# 	try:
# 		# entry = resources.revoked_store.get(jti)
# 		entry = resources.getToken(jti,False)
# 	except:
# 		traceback.print_exc()
# 		logger.error("Error", exc_info=1)
# 		entry = None
# 	if entry is None:
# 			return True
# 	entry.get("revoked",True) == True


api.add_resource(resources.Index, Routes.index)
api.add_resource(resources.Login, Routes.login)    
api.add_resource(resources.Protected, Routes.protected)    
api.add_resource(resources.UserLogoutAccess, Routes.logout)


# @app.route("/token", methods=["POST"])
# def create_token():
#     username = request.json.get("username", None)
#     password = request.json.get("password", None)
#     # Consulta la base de datos por el nombre de usuario y la contraseña
#     user = User.filter.query(username=username, password=password).first()
#     if user is None:
#           # el usuario no se encontró en la base de datos
#         return jsonify({"msg": "Bad username or password"}), 401
    
#     # crea un nuevo token con el id de usuario dentro
#     access_token = create_access_token(identity=user.id)
#     return jsonify({ "token": access_token, "user_id": user.id })

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
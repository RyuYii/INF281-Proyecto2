import copy
class clientResponses:
  index =  {"code":1 , "message": "Bienvenido al Portal de Usuarios"}
  accessToken = {"code":1, "message":"Token de acceso al sistema"}
  userVerified = {"code":1, "message":"Usuario Verificado"}
  defaultError =  {"code":0 , "message": "Ocurrió un error."}
  incorrectTypeEstament = {"code":0 , "message": "Estamento no válido"}
  userNotFound = {"code":0 , "message": "Usuario no encontrado"}
  studentNotFound = {"code":0 , "message": "Estudiante no encontrado, verifique que se encuentre matriculado en la presente gestión"}
  docentNotFound = {"code":0 , "message": "Docente no encontrado, contáctese con personal Docente"}
  docentFoundAndNotStament = {"code":0 , "message": "Usuario encontrado, pero no pertenece al estamento docente, contactese con el administrador del sitio"}
  userFoundAndExpire = {"code":0 , "message": "Usuario encontrado, pero su cuenta se encuentra expirada, contactese con el administrador del sitio"}
  userFoundAndNotExpire = {"code":0 , "message": "Usuario encontrado, pero no se puede verificar la expiración, contactese con el administrador del sitio"}
  adminFoundAndNotStament = {"code":0 , "message": "Usuario encontrado, pero no pertenece al estamento administrativo, institucional o temporal, contactese con el administrador del sitio"}
  adminOrInstNotFound = {"code":0 , "message": "Administrativo no encontrado o cuenta Institucional no encontrada"}
  studentNotVerified= {"code":0, "message":"No se pudo verificar su Registro universitario, verifique el número"}
  userNotVerifiedBirthday = {"code":0, "message":"No se pudo verificar, revise que la fecha de nacimiento sea correcta"}
  userNotVerifiedResponsable = {"code":0, "message":"No se pudo verificar su cuenta responsable, revise que el número sea correcto"}
  userResponsableEmpty = {"code":0, "message":"La cuenta no contiene responsables asignados, comuníquese con el administrador del sitio"}
  userNotVerified = {"code":0, "message":"No se pudo verificar la identidad del usuario"}
  userBirthdayNotFound = {"code":0, "message":"No se encontro una fecha de nacimiento, contáctese con el administrador del sistema"}
  userVerifiedAndAccountNotFound = {"code":0, "message":"Usuario verificado, pero no se pudo encontrar y/o crear la cuenta institucional contactese al administrador del sitio"}
  userNotEnableToThisVerification = {"code":0, "message":"No puede verificar su identidad utilizando esta ruta utilice una que corresponda a su estamento."}
  userAccountAlreadyActiveNone = {"code":0, "message":"No se pudo verificar la activacion de la cuente intente nuevamente"}
  userAccountAlreadyActive = {"code":0, "message":"La cuenta ya se encuentra activada con anterioridad"}
  userAccountNoActive = {"code":0, "message":"La cuenta no se encuentra activada"}
  userLogout = {"code":0, "message":"Sesión Terminada"}
  adminLoginError = {"code":0, "message":"Usuario no encontrado"}


def messageToken(token, expires, nextRoute):
  msj = copy.deepcopy(clientResponses.accessToken)
  msj["token"]= token
  msj["expires"]= expires
  msj = addNextRoute(msj, nextRoute)
  return msj

def addNextRoute (msj, nextRoute):
  message = copy.deepcopy(msj)
  message["next"] = nextRoute
  return message

def addObject(msj, key,val):
  message=  copy.deepcopy(msj)
  message[key] =val 
  return message
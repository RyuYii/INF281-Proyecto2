from database import db
from datetime import datetime, timedelta
from datetime import timezone

def createToken(jti: str, revoked: bool, expiresDelta: timedelta):
  expireAt = datetime.now(timezone.utc)
  if expiresDelta is None:
      expiresDelta = timedelta(minutes=30) * 1.2
  expireAt = expireAt + expiresDelta
  # print (expireAt)
  # expireAt.replace(tzinfo=timezone.utc)
  # print (expireAt)
  # print(jti,expireAt,revoked)
  # result = db.jwt.insert_one({"jti": jti, "expireAt": expireAt, "revoked": revoked})
  cursor = db.cursor()
  print(type(expireAt))
  cursor.execute(f"INSERT INTO jwt(jti, expire, revoked) VALUES ('{jti}','{expireAt}',{revoked})")
  db.close()


def revokeToken(jti: str):
  result = db.jwt.update_one({"jti": jti}, {"$set": {"revoked": True}})
  # print (result.raw_result)
  if result.raw_result.get("nModified") == 0:
    return False
  return True

def getToken(jti: str, revoked: bool):
  result = db.jwt.find_one({"jti": jti, "revoked":revoked})
  # print (result)
  return result
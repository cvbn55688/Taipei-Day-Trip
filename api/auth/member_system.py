from flask import *
from mysql.connector import pooling
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_jwt_extended import decode_token, JWTManager
from mySQL import database_connection_pool
connection_pool = database_connection_pool()

member_system = Blueprint("member_system", __name__, static_folder="static", template_folder="templates")

@member_system.route("/api/user", methods=["POST"])
def sign():
    request_newuser = request.get_json() 
    name = request_newuser["name"]
    email = request_newuser["email"]
    password = request_newuser["password"]
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor()
        sql = 'select * from member where email= %s;'
        cursor.execute(sql, (email,))
        records = cursor.fetchone()

        if records == None:
            sql = 'insert member(name, email, password) values(%s, %s, %s);'
            cursor.execute(sql, (name, email, password))
            return {"ok": True}, 200
        else:
            return  {"error": True, "message": "重複的Email"}, 400

    except Exception as e:
        return {"error": True, "message": e}, 500

    finally:
            cursor.close()
            connection.commit()
            connection.close()

@member_system.route("/api/user/auth", methods=["GET", "PUT", "DELETE"])
def login():
    if request.method == "PUT":
        request_userdata = request.get_json()
        email = request_userdata["email"]
        password = request_userdata["password"]

        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor()
            sql = 'select * from member where email = %s and password = %s ;'
            cursor.execute(sql, (email, password))
            records = cursor.fetchone()

            if records != None:
                user_data = {"user_id": records[0], "user_name": records[1], "user_email": records[2]}
                access_token = create_access_token(identity=user_data)
                refresh_token = create_refresh_token(identity=user_data)
                res = make_response({"ok": True}, 200)
                res.set_cookie("refresh_token", value=refresh_token)
                res.set_cookie("access_token", value=access_token)
                return res

            else:
                return {"error": True, "message": "信箱或密碼錯誤"}, 400
        
        except Exception as e:
            return {"error": True, "message": e}, 500

        finally:
                cursor.close()
                connection.close()
    
    if request.method == "GET":
        user_data = request.cookies.get('access_token')
        try:
            user_data = decode_token(user_data)["sub"]
            user_id = user_data["user_id"]
            user_name = user_data["user_name"]
            user_email = user_data["user_email"]
            return {"data": {"id": user_id, "name": user_name, "email": user_email}}, 200
        except:
            return {"data" : None}
    
    if request.method == "DELETE":
        res = make_response({"ok": True}, 200)
        res.set_cookie('access_token', value='', expires=0)
        res.set_cookie('refresh_token', value='', expires=0)
        return res
        
@member_system.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    res = make_response({"ok": True}, 200)
    res.set_cookie("access_token", value=access_token)
    return res

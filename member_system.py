from flask import *
from mysql.connector import pooling
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import decode_token
import jwt



member_system = Blueprint("member_system", __name__, static_folder="static", template_folder="templates")

connection_pool = pooling.MySQLConnectionPool(
                                            host = 'localhost',
                                            port= "3306",
                                            user = 'root',
                                            password = '',
                                            database = 'website',
                                            pool_name="my_pool",
                                            pool_size = 5,
                                            charset="utf8"
                                            )



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
                encoded_jwt = jwt.encode(user_data, "secret", algorithm="HS256")
                res = make_response({"ok": True}, 200)
                res.set_cookie("Set-Cookie", value=encoded_jwt, max_age=60*60*24*7)
                return res

            else:
                return {"error": True, "message": "信箱或密碼錯誤"}, 400
        
        except Exception as e:
            return {"error": True, "message": e}, 500

        finally:
                cursor.close()
                connection.close()
    
    if request.method == "GET":
        user_data = request.cookies.get('Set-Cookie')
        if user_data != None:
            user_data = jwt.decode(user_data, "secret", algorithms=["HS256"])
            user_id = user_data["user_id"]
            user_name = user_data["user_name"]
            user_email = user_data["user_email"]
            return {"data": {"id": user_id, "name": user_name}, "email": user_email}, 200
        else:
            return {"data": None}, 200
    
    if request.method == "DELETE":
        res = make_response({"ok": True}, 200)
        res.set_cookie('Set-Cookie', value='', expires=0)
        return res
        

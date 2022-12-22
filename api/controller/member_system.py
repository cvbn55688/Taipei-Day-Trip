from flask import *
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_jwt_extended import decode_token, JWTManager
from model.member_system import User

member_system = Blueprint("member_system", __name__, static_folder="static", template_folder="templates")

@member_system.route("/api/user", methods=["POST"])
def signup():
    request_newuser = request.get_json() 
    name = request_newuser["name"]
    email = request_newuser["email"]
    password = request_newuser["password"]

    user = User()
    return user.signup(name, email, password)

@member_system.route("/api/user/auth", methods=["GET", "PUT", "DELETE"])
def login():
    user = User()
    if request.method == "PUT":
        request_userdata = request.get_json()
        email = request_userdata["email"]
        password = request_userdata["password"]
        # print(user.login(email, password))
        login_response, login_status = user.login(email, password)
        print(login_response)
        if login_status == 200:
            user_data = login_response["data"]
            access_token = create_access_token(identity=user_data)
            refresh_token = create_refresh_token(identity=user_data)
            res = make_response({"ok": True}, 200)
            res.set_cookie("refresh_token", value=refresh_token)
            res.set_cookie("access_token", value=access_token)
            return res
        else:
            return login_response, login_status
    
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
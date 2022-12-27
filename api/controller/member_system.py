from flask import *
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_jwt_extended import decode_token, JWTManager
from model.member_system import User
import boto3
import time
import os 
from dotenv import load_dotenv
load_dotenv()

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
            user_phone = user_data["user_phone"]
            return {"data": {"id": user_id, "name": user_name, "email": user_email, "user_phone" : user_phone}}, 200
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

@member_system.route("/img_uploads", methods=["POST"])
def uploads_headIMG():
    user = User()
    user_data = request.cookies.get('access_token')
    if user_data != None:
        user_data = decode_token(user_data)["sub"]
        user_id = user_data["user_id"]
        now_time = str(time.time()).replace(".", "")
        request_userdata = request.get_json()
        img_base64 = request_userdata["imgBase64"]
        access_key_id = os.getenv("aws_access_key_id")
        secret_access_key = os.getenv("aws_secret_access_key")
        s3 = boto3.client(
            "s3",
            aws_access_key_id=access_key_id,
            aws_secret_access_key=secret_access_key,
        )
        s3.put_object(
            Bucket="mywebsiteforwehelp",
            Key="website_user_headIMG/"+now_time+".jpg",
            Body=img_base64, 
        )
        update_res, update_status = user.upload_user_headIMG(user_id, now_time)
        if update_status == 200:
            return update_res, 200
        else:
            return update_res, 500
    else:
        return {"error": True,"message": "使用者尚未登入"}, 403

@member_system.route("/api/user_update", methods=["PUT"])
def update_info():
    user = User()
    user_data = request.cookies.get('access_token')
    if user_data != None:
        user_data = decode_token(user_data)["sub"]
        user_id = user_data["user_id"]
        request_data = request.get_json()
        update_target = (request_data["updateTarget"])
        target_value = (request_data["targetValue"])
        update_res, update_status= user.update_user_data(user_id, update_target, target_value)
        if update_status == 200:
            access_token = create_access_token(identity=update_res)
            refresh_token = create_refresh_token(identity=update_res)
            res = make_response({"ok": True}, 200)
            res.set_cookie("refresh_token", value=refresh_token)
            res.set_cookie("access_token", value=access_token)
            return res, 200
        else:
            return update_res, 500
    else:
        return {"error": True,"message": "使用者尚未登入"}, 403

@member_system.route("/api/user/headIMG", methods=["GET"])
def get_headIMG():
    user = User()
    user_data = request.cookies.get('access_token')
    if user_data != None:
        user_data = decode_token(user_data)["sub"]
        user_id = user_data["user_id"]
        get_data_res, get_data_status = user.get_user_headIMG(user_id)
        if get_data_status == 200:
            get_data_res = get_data_res["head_img"]
            session = boto3.Session(aws_access_key_id = os.getenv("aws_access_key_id"),
                        aws_secret_access_key = os.getenv("aws_secret_access_key"))
            s3 = session.client("s3")     
            s3_object = s3.get_object(Bucket="mywebsiteforwehelp", Key = f"website_user_headIMG/{get_data_res}.jpg")
            image_data = s3_object['Body'].read()
            image_data = str(image_data, "utf-8")
            return {"data" : {"head_img" :image_data}}, 200
        else:
            return get_data_res, 500
    else:
        return {"error": True,"message": "使用者尚未登入"}, 403

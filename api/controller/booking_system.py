from flask import *
from flask_jwt_extended import decode_token
from model.booking_system import Booking
from model.booking_system import Order
import requests
import datetime
import json
import os 
from dotenv import load_dotenv
load_dotenv()

booking_system = Blueprint("booking_system", __name__, static_folder="static", template_folder="templates")

@booking_system.route("/api/booking", methods=["POST", "GET", "DELETE"])
def booking():
    booking = Booking()
    if request.method == "POST":
        user_data = request.cookies.get('access_token')
        if user_data != None:
            booking_info = request.get_json()
            date = booking_info["date"]
            tonow = datetime.datetime.now()
            now_year = str(tonow.year)
            now_month = str(tonow.month)
            now_day = str(tonow.day)
            user_year = date[0:4]
            user_month = date[5:7]
            user_day = date[8:10]
            if (user_year<now_year) or (user_year==now_year and user_month<now_month) or (user_year==now_year and user_month==now_month and user_day<now_day):
                return {"error": True,"message": "輸入錯誤日期"}, 400
            user_data = decode_token(user_data)["sub"]
            return booking.add_booking(user_data, booking_info)
        else:
            return {"error": True,"message": "使用者尚未登入"}, 403

    if request.method == "GET":
        user_data = request.cookies.get('access_token')
        if user_data != None:
            user_data = decode_token(user_data)["sub"]
            user_id = user_data["user_id"]
            return booking.get_booking(user_id)
        else:
            return {"error": True,"message": "使用者尚未登入"}, 403
    
    if request.method == "DELETE":
        user_data = request.cookies.get('access_token')
        booking_info = request.get_json()
        if user_data != None:
            return booking.delete_booking(booking_info)
        else:
            return {"error": True,"message": "使用者尚未登入"}, 403

@booking_system.route("/api/orders", methods=["POST"])
def orders():
    order = Order()
    request_orderdata = request.get_json()
    user_data = request.cookies.get('access_token')
    if user_data != None:
        user_data = decode_token(user_data)["sub"]
        user_id = user_data["user_id"]
        user_name = request_orderdata["contact"]["name"]
        user_phone = request_orderdata["contact"]["phone"]
        user_email = request_orderdata["contact"]["email"]
        if user_name == "" or user_phone == "" or user_email == "":
            return {"error": True,"message": "姓名、信箱、手機號碼不可空白"}, 400
        prime = request_orderdata["prime"]
        amount = request_orderdata["order"]["price"]
        trips = request_orderdata["order"]["trips"]
        partner_key = os.getenv("partner_key")
        url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"

        data = {
            "prime" : prime,
            "partner_key" : partner_key,
            "merchant_id" : "cvbn55688_CTBC",
            "details" : "test",
            "amount" : amount,
            "cardholder" : {
                "phone_number" : user_phone,
                "name" : user_name,
                "email" : user_email,
            },
            "remember" : True
        }
        headers = {
            "Content-Type": "application/json",
            "x-api-key": partner_key
        }
        tappay_result = requests.post(url, json=data, headers=headers)
        tappay_result = json.loads(tappay_result.text)
        if tappay_result["status"] == 0:
            tonow = datetime.datetime.now()
            now_year = str(tonow.year)
            now_month = str(tonow.month)
            now_day = str(tonow.day)
            now_hour = str(tonow.hour)
            now_minute = str(tonow.minute)
            now_second = str(tonow.second)
            number = now_year + now_month + now_day + now_hour + now_minute + now_second
            contact = request_orderdata["contact"]
            insert_list = []
            for i in trips:
                price = i["price"]
                attraction_id = i["attraction"]["id"]
                date = i["date"]
                time = i["time"]
                insert_list.append((number, price, attraction_id, json.dumps(contact, ensure_ascii=False), user_id, date, time))
                
            order_status, order_mess = order.order_pay(user_id, insert_list)
            if order_status == True:
                data = {"data" : {
                    "number" : number,
                    "payment" : {
                        "status" : 0,
                        "message" : "付款成功"
                        }
                    }   
                }
                return data, 200
            else:
                return {"error": True, "message": order_mess}, 500
        else:
            return {"error": True,"message": "訂單建立失敗，輸入不正確"}, 400
    else:
        return {"error": True,"message": "使用者尚未登入"}, 403

@booking_system.route("/api/order/<orderNumber>", methods=["GET"])
def order(orderNumber):
    order = Order()
    user_data = request.cookies.get('access_token')
    if user_data != None:
        get_order_ressulte, ressulte_status = order.get_order(orderNumber)
        if ressulte_status == 200:
            return get_order_ressulte, 200
        else:
            return get_order_ressulte, 500
    else:
        return {"error": True,"message": "使用者尚未登入"}, 403

@booking_system.route("/api/order/user", methods=["GET"])
def user_order():
    order = Order()
    user_data = request.cookies.get('access_token')
    if user_data != None:
        user_data = decode_token(user_data)["sub"]
        user_id = user_data["user_id"]
        get_order_ressulte, ressulte_status = order.get_user_order(user_id)
        if ressulte_status == 200:
            return get_order_ressulte, 200
        else: 
            return get_order_ressulte, 500
    else:
        return {"error": True,"message": "使用者尚未登入"}, 403

    


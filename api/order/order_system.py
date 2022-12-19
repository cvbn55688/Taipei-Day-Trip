from flask import *
from mysql.connector import pooling
from flask_jwt_extended import decode_token
from mySQL import connection_pool
import requests
import datetime
import json

order_system = Blueprint("order_system", __name__, static_folder="static", template_folder="templates")

@order_system.route("/api/orders", methods=["POST"])
def orders():
    if request.method == "POST":
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
            partner_key = "partner_h746F7knRWACHKImcpxN31IqNKyEkD3T3pzepshWpXJy0r6yPD1kfYT5" #測試用partner_key
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
                try:
                    connection = connection_pool.get_connection()
                    cursor = connection.cursor()
                    tonow = datetime.datetime.now()
                    now_year = str(tonow.year)
                    now_month = str(tonow.month)
                    now_day = str(tonow.day)
                    now_hour = str(tonow.hour)
                    now_minute = str(tonow.minute)
                    now_second = str(tonow.second)
                    number = now_year + now_month + now_day + now_hour + now_minute + now_second
                    contact = request_orderdata["contact"]
                    sql = 'insert orders(number, price, trips, contact, user_id, status) values(%s,%s,%s,%s,%s,%s);'
                    cursor.execute(sql, (number, amount, json.dumps(trips, ensure_ascii=False), json.dumps(contact, ensure_ascii=False), user_id, '已付款'))
                    sql = 'delete from booking where user_id = %s;'
                    cursor.execute(sql, (user_id,))
                    connection.commit()

                    data = {"data" : {
                        "number" : number,
                        "payment" : {
                            "status" : 0,
                            "message" : "付款成功"
                            }
                        }   
                    }
                    return data, 200
                except Exception as e:
                    return {"error": True, "message": e}, 500
                finally:
                    cursor.close()
                    connection.close()
            else:
                return {"error": True,"message": "訂單建立失敗，輸入不正確"}, 400
        else:
            return {"error": True,"message": "使用者尚未登入"}, 403

@order_system.route("/api/order/<orderNumber>", methods=["GET"])
def order(orderNumber):
    user_data = request.cookies.get('access_token')
    if user_data != None:
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'select * from orders where number = %s;'
            cursor.execute(sql, (orderNumber,))
            record = cursor.fetchone()
            if record != None:
                number = record["number"]
                price = record["price"]
                trip = record["trips"]
                contact = record["contact"]
                status = 1
                data = {"data" : {
                    "number" : number,
                    "price" : price,
                    "trip" : json.loads(trip),
                    "contact" : json.loads(contact),
                    "status" : status
                }}
                return data, 200
            else:
                return {"data" : None}, 200
        except Exception as e:
            return {"error": True, "message": e}, 500
        finally:
            cursor.close()
            connection.close()
    else:
        return {"error": True,"message": "使用者尚未登入"}, 403

@order_system.route("/api/order/user", methods=["GET"])
def user_order():
    user_data = request.cookies.get('access_token')
    user_data = decode_token(user_data)["sub"]
    user_id = user_data["user_id"]
    if user_data != None:
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'select * from orders where user_id = %s;'
            cursor.execute(sql, (user_id,))
            record = cursor.fetchall()
            print(record[0])
            return record, 200
        except Exception as e:
            return {"error": True, "message": e}, 500
        finally:
            cursor.close()
            connection.close()
    else:
        return {"error": True,"message": "使用者尚未登入"}, 403
from flask import *
from mysql.connector import pooling
from flask_jwt_extended import decode_token
from mySQL import connection_pool
# connection_pool = connection_pool

booking_system = Blueprint("booking_system", __name__, static_folder="static", template_folder="templates")
                                            
@booking_system.route("/api/booking", methods=["POST", "GET", "DELETE"])
def booking():
    if request.method == "POST":
        user_data = request.cookies.get('access_token')
        request_booking_info = request.get_json()
        if user_data != None:
            try:
                connection = connection_pool.get_connection()
                cursor = connection.cursor()
                user_data = decode_token(user_data)["sub"]
                user_id = user_data["user_id"]
                user_name = user_data["user_name"]
                user_email = user_data["user_email"]
                attractionId = request_booking_info["attractionId"]
                date = request_booking_info["date"]
                time = request_booking_info["time"]
                price = request_booking_info["price"]
                
                sql = 'insert booking(attraction_id, user_id, date, time, price) values(%s,%s,%s,%s,%s);'
                cursor.execute(sql, (attractionId, user_id, date, time, price))
                connection.commit()
                return {"ok" : True}, 200

            except Exception as e:
                return {"error": True, "message": e}, 500

            finally:
                cursor.close()
                connection.close()
        else:
            return {"error": True,"message": "使用者尚未登入"}, 403

    if request.method == "GET":
        user_data = request.cookies.get('access_token')
        if user_data != None:
            try:
                connection = connection_pool.get_connection()
                cursor = connection.cursor()
                user_data = decode_token(user_data)["sub"]
                user_id = user_data["user_id"]
                sql = 'select date, time, price, descrition.img, descrition.other_info, booking_id from booking inner join descrition on descrition.attraction_id = booking.attraction_id where user_id = %s'
                cursor.execute(sql, (user_id,))
                records = cursor.fetchall()
                data_list = []

                for record in records:
                    date = record[0]
                    time = record[1]
                    price = record[2]
                    imgs = record[3]
                    img = imgs.split(",")
                    img.pop()
                    booking_id = record[5]

                    attraction_info = json.loads(record[4])
                    attraction_name = attraction_info["name"]
                    attraction_id = attraction_info["id"]
                    attraction_address = attraction_info["address"]
                    attraction_info = {"id" : attraction_id, "name" : attraction_name, "address" : attraction_address, "image" : img[0], "booking_id" : booking_id}
                    data_list.append({"attraction" : attraction_info, "date" : date, "time" : time, "price" : price})

                return {"data" : data_list}, 200

            except Exception as e:
                return {"error": True, "message": e}, 500

            finally:
                cursor.close()
                connection.close()
        else:
            return {"error": True,"message": "使用者尚未登入"}, 403
    
    if request.method == "DELETE":
        user_data = request.cookies.get('access_token')
        request_booking_info = request.get_json()
        if user_data != None:
            try:
                print(connection_pool)
                connection = connection_pool.get_connection()
                cursor = connection.cursor()
                booking_id = request_booking_info["id"]
                sql = 'delete from booking where booking_id = %s;'
                cursor.execute(sql, (booking_id,))
                connection.commit()

                return {"ok" : True}, 200

            except Exception as e:
                return {"error": True, "message": e}, 500

            finally:
                cursor.close()
                connection.close()
        else:
            return {"error": True,"message": "使用者尚未登入"}, 403
from mySQL import connection_pool
import json

class Booking:
    def add_booking(self, user_data, booking_info):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor()
            user_id = user_data["user_id"]
            user_name = user_data["user_name"]
            user_email = user_data["user_email"]
            attractionId = booking_info["attractionId"]
            date = booking_info["date"]
            time = booking_info["time"]
            price = booking_info["price"]
            
            sql = 'insert booking(attraction_id, user_id, date, time, price) values(%s,%s,%s,%s,%s);'
            cursor.execute(sql, (attractionId, user_id, date, time, price))
            connection.commit()
            return {"ok" : True}, 200

        except Exception as e:
            return {"error": True, "message": e}, 500

        finally:
            cursor.close()
            connection.close()

    def get_booking(self, user_id):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'select date, time, price, image.images, attraction.*, booking.id as booking_id from booking inner join attraction on attraction.id = booking.attraction_id inner join image on attraction.id = image.attraction_id where user_id = %s'
            cursor.execute(sql, (user_id,))
            records = cursor.fetchall()
            data_list = []

            for record in records:
                date = record["date"]
                time = record["time"]
                price = record["price"]
                imgs = record["images"]
                img = imgs.split(",")
                img.pop()
                booking_id = record["booking_id"]
                attraction_name = record["name"]
                attraction_id = record["id"]
                attraction_address = record["address"]
                attraction_info = {"id" : attraction_id, "name" : attraction_name, "address" : attraction_address, "image" : img[0], "booking_id" : booking_id}
                data_list.append({"attraction" : attraction_info, "date" : date, "time" : time, "price" : price})

            return {"data" : data_list}, 200

        except Exception as e:
            return {"error": True, "message": e}, 500

        finally:
            cursor.close()
            connection.close()
    
    def delete_booking(self, booking_info):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor()
            booking_id = booking_info["id"]
            sql = 'delete from booking where id = %s;'
            cursor.execute(sql, (booking_id,))
            connection.commit()

            return {"ok" : True}, 200

        except Exception as e:
            return {"error": True, "message": e}, 500

        finally:
            cursor.close()
            connection.close()

class Order:
    def order_pay(self, user_id, insert_list):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor()
            sql = 'insert orders(number, price, attraction_id, contact, user_id, date, time) values(%s,%s,%s,%s,%s,%s,%s);'
            cursor.executemany(sql, insert_list)
            sql = 'delete from booking where user_id = %s;'
            cursor.execute(sql, (user_id,))
            connection.commit()
            return True, "ok"
        except Exception as e:
            return False, e
        finally:
            cursor.close()
            connection.close()
    
    def get_order(self, order_number):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'select * from orders where number = %s;'
            cursor.execute(sql, (order_number,))
            records = cursor.fetchall()
            if records != []:
                number = ''
                for i in records:
                    number = i["number"]
                    price = i["price"]
                    # trip = i["trips"]
                    contact = i["contact"]
                    status = 1
                data = {"data" : {
                    "number" : number,
                    "price" : price,
                    # "trip" : json.loads(trip),
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
    
    def get_user_order(self, user_id):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = """select number, user_id, contact, group_concat('{"price":"', price ,'","attraction_id":"', orders.attraction_id , '","attraction_name":"', attraction.name , '","address":"', attraction.address,  '","images":"', SUBSTRING_INDEX(image.images,',',1) , '","date":"', date , '","time":"', time ,'"}'  SEPARATOR ";") as 'grouping' from orders inner join image on orders.attraction_id = image.attraction_id inner join attraction on attraction.id = orders.attraction_id where user_id = %s group by number;"""
            cursor.execute(sql, (user_id,))
            records = cursor.fetchall()
            trip_list = []
            for order in records:
                number = order["number"]
                contact = order["contact"]
                contact = (json.loads(contact))
                attractions = order["grouping"].split(";")
                attraction_list = []
                for attraction in attractions:
                    attraction_dic = (json.loads(attraction))
                    attraction_list.append(attraction_dic)
                trip_list.append({"number" : number, "user_id" : user_id, "contact" : contact, "trips" : attraction_list})
            return trip_list, 200
        except Exception as e:
            return {"error": True, "message": e}, 500
        finally:
            cursor.close()
            connection.close()
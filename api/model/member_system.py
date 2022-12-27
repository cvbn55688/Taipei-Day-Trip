from mySQL import connection_pool

class User:
    def signup(selt, name, email, password):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor()
            sql = 'select * from member where email= %s;'
            cursor.execute(sql, (email,))
            records = cursor.fetchone()

            if records == None:
                sql = 'insert member(name, email, password) values(%s, %s, %s);'
                cursor.execute(sql, (name, email, password))
                connection.commit()
                return {"ok": True}, 200
            else:
                return  {"error": True, "message": "重複的Email"}, 400

        except Exception as e:
            return {"error": True, "message": e}, 500

        finally:
                cursor.close()
                connection.close()

    def login(self, email, password):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'select * from member where email = %s and password = %s ;'
            cursor.execute(sql, (email, password))
            records = cursor.fetchone()
            if records != None:
                user_data = {"user_id": records["id"], "user_name": records["name"], "user_email": records["email"], "user_phone" : records["phone"]}
                return {"data" : user_data}, 200
            else:
                return {"error": True, "message": "信箱或密碼錯誤"}, 400
        except Exception as e:
            return {"error": True, "message": e}, 500
        finally:
                cursor.close()
                connection.close()

    def up_load_headIMG(self, user_id, head_img):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'update member set head_img = %s where id = %s;'
            cursor.execute(sql, (head_img, user_id))
            records = cursor.fetchone()
            if records != None:
                user_data = {"user_id" : user_id, "headIMG" : head_img}
                return user_data, 
            else:
                return {"user_id" : user_id, "headIMG" : None}, 200
        except Exception as e:
            return {"error": True, "message": e}, 500
        finally:
                cursor.close()
                connection.close()

    def update_user_data(self, user_id, update_target, target_value):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            if update_target == "email":
                sql = 'select id from member where email = %s'
                cursor.execute(sql, (target_value,))
                record = cursor.fetchone()
                if record != None:
                    return  {"error": True, "message": "重複的Email"}, 400
                    
            sql = f'update member set {update_target} = {"%s"} where id = {"%s"};'
            cursor.execute(sql, (target_value, user_id))
            connection.commit()
            sql = 'select id, name, email, phone from member where id = %s;'
            cursor.execute(sql, (user_id,))
            record = cursor.fetchone()
            user_data = {"user_id": record["id"], "user_name": record["name"], "user_email": record["email"], "user_phone" : record["phone"]}
            return user_data, 200
        except Exception as e:
            print(e)
            return {"error": True, "message": e}, 500
        finally:
                cursor.close()
                connection.close()
    
    def upload_user_headIMG(self, user_id, img_name):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'update member set head_img = %s where id = %s;'
            cursor.execute(sql, (img_name, user_id))
            connection.commit()
            return {"ok" : True}, 200
        except Exception as e:
            print(e)
            return {"error": True, "message": e}, 500
        finally:
            cursor.close()
            connection.close()

    def get_user_headIMG(self, user_id):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'select head_img from member where id = %s;'
            cursor.execute(sql, (user_id,))
            record = cursor.fetchone()
            return record, 200
        except Exception as e:
            print(e)
            return {"error": True, "message": e}, 500
        finally:
            cursor.close()
            connection.close()


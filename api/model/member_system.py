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
                return {"ok": True}, 200
            else:
                return  {"error": True, "message": "重複的Email"}, 400

        except Exception as e:
            return {"error": True, "message": e}, 500

        finally:
                cursor.close()
                connection.commit()
                connection.close()

    def login(self, email, password):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'select * from member where email = %s and password = %s ;'
            cursor.execute(sql, (email, password))
            records = cursor.fetchone()
            if records != None:
                user_data = {"user_id": records["id"], "user_name": records["name"], "user_email": records["email"]}
                return {"data" : user_data}, 200
            else:
                return {"error": True, "message": "信箱或密碼錯誤"}, 400
        except Exception as e:
            return {"error": True, "message": e}, 500
        finally:
                cursor.close()
                connection.close()
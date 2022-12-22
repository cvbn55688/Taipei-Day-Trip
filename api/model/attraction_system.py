from mySQL import connection_pool

class Attraction:
    def get_categories(self):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor()
            cursor.execute('select category from categories;')
            records = cursor.fetchall()
            data_list = []
            for i in records:
                data_list.append(i[0])
            data = {"data" : data_list}
            return data, 200
        except Exception as e:
            errorMes = {"error" : True, "message" : str(e)}
            return errorMes, 500
        finally:
            cursor.close()
            connection.close()
    
    def get_attraction(self, attraction_id):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'select attraction.*, categories.category, image.images from attraction inner join categories on attraction.cat_id = categories.id inner join image on attraction.id = image.attraction_id where attraction.id = %s;'
            cursor.execute(sql, (attraction_id,))
            records = cursor.fetchone()
            images = records["images"].split(",")
            images.pop()
            del records["images"]
            records_img = {"images" : images}
            records.update(records_img)
            data = {"data" : records}
            return data, 200
        except Exception as e:
            if records == None:
                e = "景點編碼不正確"
                errorMes = {"error" : True, "message" : str(e)}
                return errorMes, 400
            else:
                errorMes = {"error" : True, "message" : str(e)}
                return errorMes, 500
        finally:
            cursor.close()
            connection.close()

    def get_attractions(self, page, keyword):
        try:
            connection = connection_pool.get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = 'select attraction.*, categories.category, image.images from attraction inner join categories on attraction.cat_id = categories.id inner join image on attraction.id = image.attraction_id where attraction.name like %s or categories.category like %s order by attraction.id limit %s, 13;'
            cursor.execute(sql, ("%"+keyword+"%", keyword, int(page)*12))
            records = cursor.fetchall()
            if len(records) == 13:
                nextpage = int(page)+1
                records.pop()
            else:
                nextpage = None
            
            data_list = []
            for record in records:
                record_img = record["images"]
                record_img = record_img.split(",")
                record_img.pop()
                record_img = {"images" : record_img}
                del record["images"]
                record.update(record_img)
                data_list.append(record)

            data = {"nextPage" : nextpage , "data" : data_list}
            return data, 200
        except Exception as e:
            errorMes = {"error" : True, "message" : str(e)}
            return errorMes, 500
        finally:
            cursor.close()
            connection.close()
from flask import *
from mysql.connector import pooling
from mysql.connector import Error

attraction_system = Blueprint("attraction_system", __name__, static_folder="static", template_folder="templates")

connection_pool = pooling.MySQLConnectionPool(
                                            host = 'localhost',
                                            port= "3306",
                                            user = 'root',
                                            password = 'zxc55332',
                                            database = 'website',
                                            pool_name="my_pool",
                                            pool_size = 5,
                                            charset="utf8"
                                            )

@attraction_system.route("/api/categories")
def categories():
	try:
		connection = connection_pool.get_connection()
		cursor = connection.cursor()
		cursor.execute('select categories from categories;')
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

@attraction_system.route("/api/attraction/<attractionId>")
def attractionID(attractionId):
	try:
		connection = connection_pool.get_connection()
		cursor = connection.cursor()
		sql = 'select img, other_info from descrition where attraction_id = %s;'
		cursor.execute(sql, (attractionId,))
		records = cursor.fetchone()			
		records_img = records[0]
		records_img = records_img.split(",")
		records_img.pop()
		records_img = {"images" : records_img}
		records_info = records[1]
		records_info = (json.loads(records_info))
		records_info.update(records_img)
		data = {"data" : records_info}
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

@attraction_system.route("/api/attractions")
def attractions():
	try:
		page = request.args.get("page")
		keyword = request.args.get("keyword")
		if keyword == None:
			keyword = ''
		connection = connection_pool.get_connection()
		cursor = connection.cursor()
		sql = 'select descrition.img, descrition.other_info from attraction inner join categories on attraction.cat_id = categories.id inner join descrition on descrition.id = attraction.id where attraction.name like %s or categories.categories like %s order by attraction.id limit %s, 13;'
		cursor.execute(sql, ("%"+keyword+"%", keyword, int(page)*12))
		records = cursor.fetchall()
    
		if len(records) == 13:
			nextpage = int(page)+1
			records.pop()
		else:
			nextpage = None
		
		data_list = []
		for record in records:
			record_img = record[0]
			record_img = record_img.split(",")
			record_img.pop()
			record_img = {"images" : record_img}
			record_info = record[1]
			record_info = (json.loads(record_info))
			record_info.update(record_img)
			data_list.append(record_info)

		data = {"nextPage" : nextpage , "data" : data_list}
		return data, 200
	except Exception as e:
		if not page or page.isdigit() == False:
			errorMes = {"error" : True, "message" : "page is not correct"}
			return errorMes, 400
		else:
			errorMes = {"error" : True, "message" : str(e)}
			return errorMes, 500
	finally:
			cursor.close()
			connection.close()
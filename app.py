from flask import *
import mysql.connector
from mysql.connector import pooling
from mysql.connector import Error

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

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

@app.route("/api/categories")
def categories():
	try:
		connection = connection_pool.get_connection()
		cursor = connection.cursor()
		cursor.execute('select categories from categories;')
		records = cursor.fetchall()
		print(records)
		data = {"data" : records}
		return data
	except Error as e:
		error = {"error" :  True, "message" : e}
		return error

	finally:
			cursor.close()
			connection.close()

@app.route("/api/attractions")
def attractions():
	try:
		connection = connection_pool.get_connection()
		cursor = connection.cursor()
		cursor.execute('select img, other_info from other_info;')
		# records = cursor.fetchall()[1]
		# records = (json.loads(records[0]))
		records = cursor.fetchall()[0]
		print(records)
		data = {"data" : records}
		return data
	except Error as e:
		error = {"error" :  True, "message" : e}
		return error

	finally:
			cursor.close()
			connection.close()

app.run(port=3000, debug = True)
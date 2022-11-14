import json
from flask import *
import mysql.connector
from mysql.connector import pooling
from mysql.connector import Error

with open("taipei-attractions.json", encoding="utf-8") as f:
    data = json.load(f)
    data = data["result"]["results"]


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

try:
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    for i in data:
        id = i["_id"]
        name = i["name"]
        category = i["CAT"].replace("\u3000", "")

        img = i["file"]
        img = img.split("https")
        img_total = ""
        for j in img:
            a = ("https" + j)
            if a[-4::] == ".JPG" or a[-4::] == ".jpg" or a[-4::] == ".png" or a[-4::] == ".PNG":
                img_total += a + ","
        del i["file"]

        other_info = json.dumps(i, ensure_ascii=False)

        if category == "歷史建築":
            cat_id = 1
        elif category == "其他":
            cat_id = 2
        elif category == "養生溫泉":
            cat_id = 3
        elif category == "單車旅遊":
            cat_id = 4
        elif category == "藍色公路":
            cat_id = 5
        elif category == "戶外踏青":
            cat_id = 6
        elif category == "宗教信仰":
            cat_id = 7
        elif category == "藝文館所":
            cat_id = 8
        elif category == "親子共遊":
            cat_id = 9


        # cursor.execute(f"insert categories(categories) values('{category}')")
        # 種類
        sql = "insert other_info(img, other_info) values(%s, %s)"
        cursor.execute(sql, (img_total, other_info.encode("utf8")))
        sql2 = "insert attraction(name, cat_id) values(%s, %s)"
        cursor.execute(sql2, (name, cat_id))
        connection.commit()
finally:
    cursor.close()
    connection.close()
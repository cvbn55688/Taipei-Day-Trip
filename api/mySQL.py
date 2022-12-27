from flask import *
from mysql.connector import pooling

connection_pool = pooling.MySQLConnectionPool(
                                            host = 'localhost',
                                            port= "3306",
                                            user = 'root',
                                            password = '',
                                            database = 'website3',
                                            pool_name="my_pool",
                                            pool_size = 5,
                                            charset="utf8"
                                            )



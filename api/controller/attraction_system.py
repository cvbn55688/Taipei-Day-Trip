from flask import *
from model.attraction_system import Attraction
import os
from dotenv import load_dotenv
load_dotenv()

attraction_system = Blueprint("attraction_system", __name__, static_folder="static", template_folder="templates")

@attraction_system.route("/api/categories")
def categories():
    attraction = Attraction()
    return attraction.get_categories()

@attraction_system.route("/api/attraction/<attractionId>")
def attractionID(attractionId):
    attraction = Attraction()
    return attraction.get_attraction(attractionId)

@attraction_system.route("/api/attractions")
def attractions():
    attraction = Attraction()
    try:
        print(os.getenv("mySQL"))

        page = request.args.get("page")
        keyword = request.args.get("keyword")
        if keyword == None:
            keyword = ''
        return attraction.get_attractions(page, keyword)
    except:
        if not page or page.isdigit() == False:
            errorMes = {"error" : True, "message" : "page is not correct"}
            return errorMes, 400
from pprint import pprint
from flask import Flask, request, jsonify
from flask_cors import CORS
import googlemaps
import requests
import xml.etree.ElementTree as ET
from flask_cors import cross_origin
from services import *
from utils import calculate_cost_to_drive, convert_mpg_to_l_100km

app = Flask(__name__)
#CORS(app)  # Enable CORS to allow requests from React
CORS(app, origins=["http://localhost:3000"])

API_KEY = 'AIzaSyDE6Z6t0y_yj248Tq-o4RsBqAdTrIzl8Mc'

map_client = googlemaps.Client(API_KEY)

work_place_address = '1 Market St, San Francisco, CA'
other_address = 'Ottawa, ON'
response = map_client.distance_matrix(work_place_address, other_address)
response = map_client.geocode(work_place_address)

### Returns distance between the two locations, the user's location
# and the restaurant locaton ###
@app.route('/get_distance', methods=['POST'])
@cross_origin()  # Enable CORS for this specific route
def get_distance():
    data = request.json
    user_location = data.get('user_location')
    restaurant_location = data.get('restaurant_location')
    try:
        distance_km = get_distance_from_google_maps(user_location, restaurant_location)
        return jsonify({'distance_km': distance_km}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/get_postal_code', methods=['POST'])
@cross_origin()  # Enable CORS for this specific route
def get_postal_code():
    data = request.json
    user_longitude = data.get('longitude')
    user_latitude = data.get('latitude')
    print(user_longitude, user_latitude)
    global postal_code
    try:
        postal_code = get_postal_code_data((user_latitude, user_longitude))
        return jsonify({'postal_code': postal_code}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_fuel_consumption', methods=['POST'])
def get_fuel_consumption():
    data = request.get_json()
    try:
        fuel_consumption = convert_mpg_to_l_100km(int(get_fuel_consumption_data(data)))
        return jsonify({'fuel_consumption': fuel_consumption}), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500

### This is a GET route that returns gas price data. ###
@app.route('/get_gas_price', methods=['GET'])
def get_gas_price():
    # Example gas price data
    gas_price = get_gas_price_data(postal_code)
    return jsonify({'gas_price': gas_price}), 200

@app.route('/years', methods=['GET'])
def get_model_years():
    years = []
    model_years_url = "https://www.fueleconomy.gov/ws/rest/vehicle/menu/year"
    response = requests.get(model_years_url)
    root = ET.fromstring(response.content).findall('.//value')
    for i in root:
        years.append(i.text)
    return jsonify(years)


@app.route('/makes', methods=['POST'])
def get_vehicle_makes():
    data = request.get_json()
    year = data.get('year')
    makes = []
    makes_url = f"https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year={year}"
    response = requests.get(makes_url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to retrieve makes data'}), 500

    root = ET.fromstring(response.content).findall('.//value')
    for i in root:
        makes.append(i.text)
    
    return jsonify(makes)

### This is a POST route where the front end will send data 
# (like distance, gas price, and delivery fee). The back end will 
# then calculate the driving cost and compare it to the delivery fee. 
# It returns the calculated costs and a comparison result in JSON format. ###
@app.route('/calculate_cost', methods=['POST'])
@cross_origin()  # Enable CORS for this specific route
def calculate_cost():
    data = request.json
    result = calculate_cost_to_drive(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

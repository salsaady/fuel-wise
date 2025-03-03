from pprint import pprint
from flask import Flask, request, jsonify
import requests
import xml.etree.ElementTree as ET
from flask_cors import CORS, cross_origin
from services import *
from utils import calculate_cost_to_drive, convert_mpg_to_l_100km
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app, origins=[os.getenv('FRONTEND_URL')])  # Enable CORS to allow requests from React

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    input_text = request.args.get('input')
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    if not input_text:
        return jsonify({"error": "No input provided"}), 400
    
    location = f"{latitude},{longitude}"

    url = "https://maps.googleapis.com/maps/api/place/autocomplete/json"
    params = {
        "input": input_text,
        "key": API_KEY,
        "types": ["geocode","establishment"],
        "location": location,
        "radius": 5000,
        "locationbias": True,
    }
    
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch suggestions"}), 500
    
    suggestions = response.json().get("predictions", [])
    print(suggestions)
    return jsonify(suggestions)

### Returns distance between the two locations, the user's location
# and the destination locaton ###
@app.route('/get_distance', methods=['POST'])
def get_distance():
    data = request.json
    start_location = data.get('start_location')
    dest_location = data.get('destination_location')
    try:
        distance_km = get_distance_from_google_maps(start_location, dest_location)
        return jsonify({'distance_km': distance_km}), 200
    
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
@app.route('/get_gas_price', methods=['POST'])
def get_gas_price():
    body = request.get_json() 
    user_latitude = body.get('latitude')
    user_longitude = body.get('longitude')
    try:
        postal_code = get_postal_code_data((user_latitude, user_longitude))
        gas_price = get_gas_price_data(postal_code)
        return jsonify({'gas_price': gas_price}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

@app.route('/models', methods=['POST'])
def get_vehicle_models():
    data = request.get_json()
    year = data.get('year')
    make = data.get('make')

    models = []
    models_url = f"https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year={year}&make={make}"
    response = requests.get(models_url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to retrieve models data'}), 500

    root = ET.fromstring(response.content).findall('.//value')
    for i in root:
        models.append(i.text)
    
    return jsonify(models)

### This is a POST route where the front end will send data 
# (like distance, gas price, and delivery fee). The back end will 
# then calculate the driving cost and compare it to the delivery fee. 
# It returns the calculated costs and a comparison result in JSON format. ###
@app.route('/calculate_cost', methods=['POST'])
def calculate_cost():
    data = request.json
    result = calculate_cost_to_drive(data)
    return jsonify(result)

# if __name__ == '__main__':
#     app.run(host='localhost', port=5000, debug=True)

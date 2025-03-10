"""
app.py

This is the main Flask application for Fuel Wise.
It provides endpoints for autocomplete suggestions, distance calculation,
fuel consumption lookup, gas price retrieval, vehicle data, and final cost
calculation. Environment variables are loaded from the .env file.
"""

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

@app.route("/")
def index():
    return "Welcome to my FuelWise server!"

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    """
    Provides autocomplete suggestions for locations using the Google Maps API.

    Expects query parameters:
        - input: the text input for the autocomplete search
        - latitude: the current latitude of the user
        - longitude: the current longitude of the user

    Returns:
        A JSON array of suggested places.
    """
    input_text = request.args.get('input')
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    if not input_text:
        return jsonify({"error": "No input provided"}), 400
    
    # Build location string for Google Maps API
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
    """
    Calculates the driving distance between the start location and destination.

    Expects a JSON body with:
        - start_location: a string representing the user's start location 
        - destination_location: a string representing the destination

    Returns:
        A JSON object with the driving distance in kilometers.
    """
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
    """
    Retrieves the fuel consumption for a specified vehicle and converts
    it from MPG to L/100km.

    Expects a JSON body with:
        - year: the vehicle's model year
        - make: the vehicle's make
        - model: the vehicle's model

    Returns:
        A JSON object with the fuel consumption (L/100km).
    """
    data = request.get_json()
    try:
        fuel_consumption = convert_mpg_to_l_100km(int(get_fuel_consumption_data(data)))
        return jsonify({'fuel_consumption': fuel_consumption}), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500

@app.route('/get_gas_price', methods=['POST'])
def get_gas_price():
    """
    Retrieves the gas price for the area specified by the user's latitude
    and longitude. The postal code is reverse-geocoded and then used to
    query gas price data.

    Expects a JSON body with:
        - latitude: the user's latitude
        - longitude: the user's longitude

    Returns:
        A JSON object with the gas price (in cents per liter).
    """
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
    """
    Fetches available vehicle model years from FuelEconomy.gov.

    Returns:
        A JSON array of model years.
    """
    years = []
    model_years_url = "https://www.fueleconomy.gov/ws/rest/vehicle/menu/year"
    response = requests.get(model_years_url)
    root = ET.fromstring(response.content).findall('.//value')
    for i in root:
        years.append(i.text)
    return jsonify(years)


@app.route('/makes', methods=['POST'])
def get_vehicle_makes():
    """
    Retrieves available vehicle makes for a given model year.

    Expects a JSON body with:
        - year: the selected model year

    Returns:
        A JSON array of vehicle makes.
    """
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
    """
    Retrieves available vehicle models for a given year and make.

    Expects a JSON body with:
        - year: the selected model year
        - make: the selected vehicle make

    Returns:
        A JSON array of vehicle models.
    """
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

@app.route('/calculate_cost', methods=['POST'])
def calculate_cost():
    """
    Calculates the driving cost for a trip based on:
      - Distance (in km)
      - Gas price (in cents per liter)
      - Fuel consumption (in L/100km)
      
    Returns:
        A JSON object containing the cost to drive.
    """
    data = request.json
    result = calculate_cost_to_drive(data)
    return jsonify(result)

# if __name__ == '__main__':
#     app.run(host='localhost', port=5000, debug=True)

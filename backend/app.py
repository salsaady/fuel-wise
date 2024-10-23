from pprint import pprint
from flask import Flask, request, jsonify
from flask_cors import CORS
import googlemaps
import requests
import xml.etree.ElementTree as ET
from flask_cors import cross_origin

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
        # Call the Google Maps Distance Matrix API
        response = map_client.distance_matrix(user_location, restaurant_location, mode="driving")

        # Extract the distance in kilometers from the response
        if response['rows'][0]['elements'][0]['status'] == 'OK':
            distance_meters = response['rows'][0]['elements'][0]['distance']['value']  # Distance in meters
            distance_km = distance_meters / 1000  # Convert meters to kilometers

            return jsonify({'distance_km': distance_km}), 200
        else:
            return jsonify({'error': 'Unable to calculate distance'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/get_fuel_consumption', methods=['POST'])
def get_fuel_consumption():
    data = request.get_json()
    car_year = data.get('year')
    car_make = data.get('make')
    car_model = data.get('model')

    # Get the vehicle options (includes vehicle ID)
    vehicle_options_url = f"https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year={car_year}&make={car_make}&model={car_model}"
    options_response = requests.get(vehicle_options_url)

    # Print the status code and content for debugging
    print(f"Status Code: {options_response.status_code}")
    print(f"Response Content: {options_response.content}")  # Inspect the XML response

    if options_response.status_code != 200:
        return jsonify({'error': 'Failed to get vehicle options'}), 400

    # Ensure response content is not empty before parsing
    if not options_response.content:
        return jsonify({'error': 'Empty response from API'}), 400

    #  Parse the XML response to get the vehicle ID
    try:
        options_root = ET.fromstring(options_response.content)
        vehicle_id_element = options_root.find('.//value')  # Adjust based on actual XML structure

        if vehicle_id_element is None:
            print("Vehicle ID not found in the XML response")
            return jsonify({'error': 'Vehicle ID not found in the XML response'}), 400

        vehicle_id = vehicle_id_element.text  # Get the vehicle ID
    except ET.ParseError as e:
        print(f"Error parsing XML: {e}")
        return jsonify({'error': 'Error parsing XML response'}), 400

    # Step 4: Use the vehicle ID to get fuel consumption (continue as before)
    vehicle_data_url = f"https://www.fueleconomy.gov/ws/rest/vehicle/{vehicle_id}"
    vehicle_data_response = requests.get(vehicle_data_url)

    if vehicle_data_response.status_code != 200:
        return jsonify({'error': 'Failed to get vehicle data'}), 400

    data_root = ET.fromstring(vehicle_data_response.content)
    fuel_consumption = data_root.find('comb08').text

    return jsonify({'fuel_consumption': fuel_consumption}), 200

### This is a GET route that returns mock gas price data. ###
@app.route('/get_gas_price', methods=['GET'])
def get_gas_price():
    # Example gas price data
    gas_price = 1.30
    return jsonify({'gas_price': gas_price}), 200

### This is a POST route where the front end will send data 
# (like distance, gas price, and delivery fee). The back end will 
# then calculate the driving cost and compare it to the delivery fee. 
# It returns the calculated costs and a comparison result in JSON format. ###
@app.route('/calculate_cost', methods=['POST'])
def calculate_cost():
    data = request.json
    distance_km = data.get('distance_km')
    gas_price_per_liter = data.get('gas_price_per_liter')
    delivery_fee = data.get('delivery_fee')

    # Calculate driving cost (example calculation)
    fuel_efficiency = 8.0
    cost_of_drive = (distance_km / fuel_efficiency) * gas_price_per_liter

    result = {
        'drive_cost': cost_of_drive,
        'is_delivery_cheaper': cost_of_drive > delivery_fee
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

### This file contains the logic for making requests to external APIs ###
import googlemaps
import requests
import xml.etree.ElementTree as ET


API_KEY = 'AIzaSyDE6Z6t0y_yj248Tq-o4RsBqAdTrIzl8Mc'
map_client = googlemaps.Client(API_KEY)

def get_distance_from_google_maps(user_location, restaurant_location):

    # Call the Google Maps Distance Matrix API
    response = map_client.distance_matrix(user_location, restaurant_location, mode="driving")

    # Extract the distance in kilometers from the response
    if response['rows'][0]['elements'][0]['status'] == 'OK':
        distance_meters = response['rows'][0]['elements'][0]['distance']['value']  # Distance in meters
        distance_km = distance_meters / 1000  # Convert meters to kilometers

        return distance_km
    else:
        raise Exception('Unable to calculate distance')

def get_fuel_consumption_data(data):
    car_year = data.get('year')
    car_make = data.get('make')
    car_model = data.get('model')

    vehicle_options_url = f"https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year={car_year}&make={car_make}&model={car_model}"
    options_response = requests.get(vehicle_options_url)

    if options_response.status_code != 200 or not options_response.content:
        raise Exception('Failed to get vehicle options')

    options_root = ET.fromstring(options_response.content)
    vehicle_id_element = options_root.find('.//value')

    if vehicle_id_element is None:
        raise Exception('Vehicle ID not found in the XML response')

    vehicle_id = vehicle_id_element.text

    vehicle_data_url = f"https://www.fueleconomy.gov/ws/rest/vehicle/{vehicle_id}"
    vehicle_data_response = requests.get(vehicle_data_url)

    if vehicle_data_response.status_code != 200:
        raise Exception('Failed to get vehicle data')

    data_root = ET.fromstring(vehicle_data_response.content)
    return data_root.find('comb08').text  # Combined MPG

def get_gas_price_data():
    return 1.30 # Sample data placeholder
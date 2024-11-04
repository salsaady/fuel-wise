### This file contains the logic for making requests to external APIs ###
from flask import jsonify
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

def get_postal_code_data(position):
    response = map_client.reverse_geocode(position, result_type='postal_code')
    postal_code = response[0]['address_components'][0]['long_name']
    return postal_code


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

def get_gas_price_data(postal_code):
    url = "https://www.gasbuddy.com/graphql"
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

    }
    # The GraphQL query
    query = '''
    query LocationBySearchTerm($search: String) {
        locationBySearchTerm(search: $search) {
            trends {
                areaName
                country
                today
                todayLow
            }
        }
    }
    '''
    
    # the payload contains the actual query and any necessary variables that are being sent to the server
    payload = {
        "query": query,
        "variables": {
            "search": postal_code
        }
    }

    # Make the request
    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        trends = data['data']['locationBySearchTerm']['trends']
        # Extract the gas prices
        smallest_region = trends[0]
        todays_gas_price = smallest_region['today']
        return todays_gas_price
    else:
        raise Exception('Failed to get gas price data')

# Example usage
# get_gas_price("K1V1R2")  # Postal code for Ottawa, Ontario, Canada
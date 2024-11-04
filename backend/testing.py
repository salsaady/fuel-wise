import requests
import xml.etree.ElementTree as ET

# # Step 1: Make the API request to get the list of years
# response = requests.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/year')

# # Step 2: Check if the response was successful
# if response.status_code == 200:
#     # Step 3: Parse the XML content
#     root = ET.fromstring(response.content)
    
#     # Step 4: Extract and print the available years
#     print("Available Model Years:")
#     for menu_item in root.findall('menuItem'):
#         year_text = menu_item.find('text').text  # Get the 'text' element
#         year_value = menu_item.find('value').text  # Get the 'value' element
#         print(f"Year: {year_text}, Value: {year_value}")
# else:
#     print("Failed to retrieve data:", response.status_code)

# def get_gas_price(postal_code):
#     url = "https://www.gasbuddy.com/graphql"
#     headers = {
#         'Content-Type': 'application/json',
#         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

#     }
#     # The GraphQL query
#     query = '''
#     query LocationBySearchTerm($search: String) {
#         locationBySearchTerm(search: $search) {
#             trends {
#                 areaName
#                 country
#                 today
#                 todayLow
#             }
#         }
#     }
#     '''
    
#     # the payload contains the actual query and any necessary variables that are being sent to the server
#     payload = {
#         "query": query,
#         "variables": {
#             "search": postal_code  # Pass the postal code here, for example, "K1A0B1"
#         }
#     }

#     # Make the request
#     response = requests.post(url, json=payload, headers=headers)

#     # Check if the request was successful
#     if response.status_code == 200:
#         data = response.json()
#         trends = data['data']['locationBySearchTerm']['trends']
#         # Extract the gas prices
#         smallest_region = trends[0]
#         print(trends[0])
#         print('Printing this...',smallest_region['areaName'])
#         print(f"Area: {smallest_region['areaName']}, Country: {smallest_region['country']}")
#         print(f"Today's Gas Price: {smallest_region['today']}, Lowest Price: {smallest_region['todayLow']}")
#         todays_gas_price = smallest_region['today']
#         return todays_gas_price
#     else:
#         print(f"Failed to fetch gas prices. Status code: {response.status_code}")

# # Example usage
# get_gas_price("K1V1R2")  # Postal code for Ottawa, Ontario, Canada
### This file contains the logic for making requests to external APIs ###
import googlemaps
import requests
import xml.etree.ElementTree as ET
from pprint import pprint
from flask import Flask, request, jsonify
from flask_cors import CORS
import googlemaps
import requests
import xml.etree.ElementTree as ET
from flask_cors import cross_origin
from services import *
from utils import calculate_cost_to_drive

API_KEY = 'AIzaSyDE6Z6t0y_yj248Tq-o4RsBqAdTrIzl8Mc'
map_client = googlemaps.Client(API_KEY)

# def get_postal_code_data(position):
#     response = map_client.reverse_geocode(position, result_type='postal_code')
#     postal_code = response[0]['address_components'][0]['long_name']
#     return postal_code

# def get_postal_code():
#     data = request.json
#     user_location = data.get('user_location')

#     try:
#         postal_code = get_postal_code_data(user_location)
#         return jsonify({'postal_code': postal_code}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    
# print(get_postal_code_data((45.2837483, -75.6903354)))

def get_model_years_data():
    years = []
    model_years_url = "https://www.fueleconomy.gov/ws/rest/vehicle/menu/year"
    response = requests.get(model_years_url)
    root = ET.fromstring(response.content).findall('.//value')
    for i in root:
        years.append(i.text)
    return ( years)

def get_vehicle_makes(year):
      # retrieve the year from the query parameters
    makes = []
    makes_url = f"https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year={year}"
    response = requests.get(makes_url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to retrieve makes data'}), 500

    root = ET.fromstring(response.content).findall('.//value')
    for i in root:
        makes.append(i.text)
    
    return makes


def get_vehicle_models():
    data = request.get_json()
    year = data.get('year')
    make = data.get('make')

    models = []
    models_url = f"https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year={year}model?make={make}"
    response = requests.get(models_url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to retrieve models data'}), 500

    root = ET.fromstring(response.content).findall('.//value')
    for i in root:
        models.append(i.text)
    
    return jsonify(models)

def get_vehicle_models(year, make):
    models = []
    models_url = f"https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year={year}&make={make}"
    response = requests.get(models_url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to retrieve models data'}), 500

    root = ET.fromstring(response.content).findall('.//value')
    for i in root:
        models.append(i.text)
    
    return (models)

print(get_model_years_data())

print(get_vehicle_makes(2022))
print(get_vehicle_models(2022, 'toyota'))
import requests
import xml.etree.ElementTree as ET

# Step 1: Make the API request to get the list of years
response = requests.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/year')

# Step 2: Check if the response was successful
if response.status_code == 200:
    # Step 3: Parse the XML content
    root = ET.fromstring(response.content)
    
    # Step 4: Extract and print the available years
    print("Available Model Years:")
    for menu_item in root.findall('menuItem'):
        year_text = menu_item.find('text').text  # Get the 'text' element
        year_value = menu_item.find('value').text  # Get the 'value' element
        print(f"Year: {year_text}, Value: {year_value}")
else:
    print("Failed to retrieve data:", response.status_code)

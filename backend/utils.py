### Reusable functions ###

def calculate_cost_to_drive(data):
    distance_km = data.get('distance')
    gas_price_per_liter = data.get('gasPrice')

    # Adjust fuel efficiency from L/100km to L/km and calculate total fuel used
    fuel_efficiency = data.get('fuelConsumption')  # L/100km
    fuel_used = (distance_km / 100) * fuel_efficiency
    
    # Calculate cost to drive
    cost_to_drive = round(((fuel_used * gas_price_per_liter / 100 ) * 2), 2) # Gas price in dollars roundtrip
    
    return {
        'cost_to_drive': cost_to_drive,
    }


def convert_mpg_to_l_100km(mpg):
    l_per_100km = 235.214/mpg
    return l_per_100km
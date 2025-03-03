### Reusable functions ###

def calculate_cost_to_drive(data):
    """
    Calculate the cost to drive a trip based on distance, gas price, and fuel consumption.
    
    Parameters:
        data (dict): Contains the following keys:
            - 'distance': Trip distance in kilometers.
            - 'gasPrice': Gas price in cents per liter.
            - 'fuelConsumption': Fuel consumption in L/100km.
    
    Returns:
        dict: A dictionary with 'cost_to_drive', the cost calculated (rounded to 2 decimals).
    """
    distance_km = data.get('distance')
    gas_price_per_liter = data.get('gasPrice')

    # convert fuel efficiency from L/100km to L/km and calculate total fuel used
    fuel_efficiency = data.get('fuelConsumption')  # L/100km
    fuel_used = (distance_km / 100) * fuel_efficiency
    
    # Calculate cost to drive convert from cents to dollars
    cost_to_drive = round(((fuel_used * gas_price_per_liter / 100 )), 2)
    
    return {
        'cost_to_drive': cost_to_drive,
    }


def convert_mpg_to_l_100km(mpg):
    """
    Convert fuel efficiency from miles per gallon (MPG) to liters per 100 kilometers (L/100km).
    
    Parameters:
        mpg (float or int): Fuel efficiency in miles per gallon.
    
    Returns:
        float: Fuel efficiency in L/100km.
    """
    l_per_100km = 235.214/mpg
    return l_per_100km
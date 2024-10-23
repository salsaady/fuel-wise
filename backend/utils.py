### Reusable functions ###

def calculate_cost_to_drive(data):
    distance_km = data.get('distance_km')
    gas_price_per_liter = data.get('gas_price_per_liter')
    delivery_fee = data.get('delivery_fee')

    fuel_efficiency = 8.0  # Example fuel efficiency
    cost_of_drive = (distance_km / fuel_efficiency) * gas_price_per_liter

    return {
        'drive_cost': cost_of_drive,
        'is_delivery_cheaper': cost_of_drive > delivery_fee
    }

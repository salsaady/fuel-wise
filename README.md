# Delivery Cost Calculator

A web application that compares the cost of driving to a restaurant versus getting food delivered. The app calculates the driving cost based on the distance between the user's location and the restaurant, fuel consumption of the user's car, and the current gas price, then compares it with the delivery fee.

## Features

- **Distance Calculation**: Calculates the driving distance between the user’s location and a specified restaurant.
- **Fuel Consumption**: Retrieves fuel consumption information based on the user's vehicle year, make, and model.
- **Gas Price**: Fetches the current gas price for cost calculation.
- **Cost Comparison**: Compares the cost of driving versus the delivery fee to help users decide the most cost-effective option.

## Installation

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
3. Run the Flask backend server:
   ```bash
   python app.py

### Frontend
1. Navigate to the frontend directory and install the required dependencies:
   ```bash
   npm install
2. Start the React development server:
   ```bash
   npm start

### Usage
1. Open the app in your browser (usually available at http://localhost:3000).
2. Input your vehicle's year, make, and model in the form provided.
3. The app will retrieve the fuel consumption and gas price to calculate the driving cost.
4. Compare the driving cost with the delivery fee to make your decision.

### Technologies
1. Frontend: React, JavaScript
2. Backend: Flask, Python
3. APIs: Google Maps API, Fuel Economy API, GasBuddy API

import requests
import datetime
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import tempfile
from flask import Flask, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def generate_heatmap():
    # Call the Node.js API to get random data
    api_url = 'http://localhost:3000/v1/get-net-notional-gamma'
    response = requests.get(api_url)
    api_data = response.json()

    y_values = api_data['yValues']
    x_dates = [datetime.datetime.strptime(date, '%Y-%m-%d').date() for date in api_data['xDates']]
    data = api_data['data']

    # Create a DataFrame for the heatmap
    df = pd.DataFrame(data, index=y_values, columns=x_dates)

    # Set up an even larger figure size
    plt.figure(figsize=(12, 10))

    # Your Seaborn heatmap code
    sns.heatmap(df, annot=True, cmap='viridis')

    # Customize tick labels for better readability
    plt.yticks(np.arange(len(y_values)) + 0.5, y_values[::-1])  # Reverse Y-axis values for better orientation
    plt.xticks(np.arange(len(x_dates)) + 0.5, [date.strftime('%Y-%m-%d') for date in x_dates], rotation=45)

    # Save the plot to a temporary file
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
        plt.savefig(temp_file.name)

    # Close the plot
    plt.close()

    # Send the generated image to the client
    return send_file(temp_file.name, mimetype='image/png')

if __name__ == '__main__':
    app.run(port=5000)

from flask import Flask, jsonify
from flask_cors import CORS
from square.client import Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

square_client = Client(
    access_token=os.getenv('SQUARE_ACCESS_TOKEN'),
    environment='sandbox'  # Change to 'production' for live data
)

@app.route('/fetch-transactions', methods=['GET'])
def fetch_transactions():
    try:
        result = square_client.payments.list_payments()
        if result.is_success():
            return jsonify(result.body)
        else:
            return jsonify({"error": result.errors}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

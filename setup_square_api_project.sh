#!/bin/bash

# Create main project directory and navigate into it
mkdir -p square_api_project
cd square_api_project

# Create backend structure
mkdir -p backend
touch backend/app.py
touch backend/requirements.txt

# Create initial requirements.txt content
cat > backend/requirements.txt << 'EOF'
flask==2.0.1
flask-cors==3.0.10
requests==2.26.0
python-dotenv==0.19.0
square==17.1.0.20211020
EOF

# Create initial app.py content
cat > backend/app.py << 'EOF'
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
EOF

# Create frontend structure
mkdir -p frontend/css
touch frontend/index.html
touch frontend/script.js
touch frontend/css/styles.css

# Create index.html content
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Square Transactions</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <h1>Square Transactions</h1>
    <button id="fetch-transactions">Fetch Transactions</button>
    <p id="status"></p>
    <table id="transactions-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            <!-- Data will be populated here -->
        </tbody>
    </table>

    <script src="script.js"></script>
</body>
</html>
EOF

# Create script.js content
cat > frontend/script.js << 'EOF'
const API_URL = 'http://localhost:5000/fetch-transactions';

async function fetchTransactions() {
    const statusEl = document.getElementById('status');
    const tableBody = document.querySelector('#transactions-table tbody');

    statusEl.textContent = 'Fetching transactions...';
    tableBody.innerHTML = ''; // Clear previous data

    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const transactions = await response.json();
            statusEl.textContent = 'Transactions loaded successfully';
            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.id}</td>
                    <td>$${parseFloat(transaction.amount / 100).toFixed(2)}</td>
                    <td>${transaction.status}</td>
                    <td>${new Date(transaction.created_at).toLocaleString()}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        statusEl.classList.add('error');
        statusEl.textContent = 'Error loading transactions. Please try again.';
    }
}

document.getElementById('fetch-transactions').addEventListener('click', fetchTransactions);
EOF

# Create styles.css content
cat > frontend/css/styles.css << 'EOF'
body {
    font-family: Arial, sans-serif;
    margin: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f4f4f4;
}

.error {
    color: red;
}

#fetch-transactions {
    padding: 10px 20px;
    margin-bottom: 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#fetch-transactions:hover {
    background-color: #45a049;
}

#status {
    margin: 10px 0;
    padding: 10px;
    border-radius: 4px;
}
EOF

# Create .env file template
cat > backend/.env << 'EOF'
SQUARE_ACCESS_TOKEN=your_square_access_token_here
EOF

# Make the script executable
chmod +x setup_square_api_project.sh

# Create README
cat > README.md << 'EOF'
# Square API Project

This project displays transactions from Square API.

## Setup

1. Install Python requirements:
   ```
   cd backend
   pip install -r requirements.txt
   ```

2. Set your Square API token in `backend/.env`

3. Run the backend:
   ```
   cd backend
   python app.py
   ```

4. Open frontend/index.html in your browser

## Structure
```
square_api_project/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── css/
    │   └── styles.css
    ├── index.html
    └── script.js
```
EOF

echo "Project setup complete! Please check the README.md for next steps."
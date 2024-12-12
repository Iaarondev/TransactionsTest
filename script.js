const ACCESS_TOKEN = 'EAAAl-h3evzXiERJMwK0uirGJlq_Pe-KTUgy-7j_buUEFkeUVTNXSkPbrBtpOgsd';
const BASE_URL = 'https://connect.squareup.com/v2';
const location_id = 'L1B1NDVKJX5K0';

const headers = {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
};

document.getElementById('fetch-transactions').addEventListener('click', fetchTransactions);

async function fetchTransactions() {
    const statusEl = document.getElementById('status');
    const tableBody = document.querySelector('#transactions-table tbody');

    statusEl.textContent = 'Fetching transactions...';
    tableBody.innerHTML = ''; // Clear previous data

    const url = `${BASE_URL}/payments?location_id=${location_id}&begin_time=2024-01-01T00:00:00Z&end_time=2024-12-31T23:59:59Z`;

    try {
        const response = await fetch(url, { headers });
        if (response.ok) {
            const data = await response.json();
            const payments = data.payments || [];

            statusEl.textContent = `Fetched ${payments.length} transactions.`;
            payments.forEach(payment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${payment.id}</td>
                    <td>${payment.amount_money.amount / 100} ${payment.amount_money.currency}</td>
                    <td>${payment.status}</td>
                    <td>${payment.created_at}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }
    } catch (error) {
        console.error(error);
        statusEl.textContent = `Error fetching transactions: ${error.message}`;
    }
}

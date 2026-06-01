import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const TOTAL_REQUESTS = 1500; 

async function runLoadTest() {
  console.log(`🚀 Starting load test with ${TOTAL_REQUESTS} concurrent requests...`);

  try {
    const loginRes = await axios.post(`${API_URL}/login`, { username: 'tester_bot' });
    const token = loginRes.data.token;

    const headers = { Authorization: `Bearer ${token}` };
    const requests = Array.from({ length: TOTAL_REQUESTS }).map(() =>
      axios.post(`${API_URL}/book`, {}, { headers })
    );

    console.log('⚡ Firing requests...');
    const results = await Promise.allSettled(requests);

    let successful = 0;
    let failed = 0;

    results.forEach((res) => {
      if (res.status === 'fulfilled') {
        successful++;
      } else {
        failed++;
      }
    });

    console.log('--- 📊 Load Test Results ---');
    console.log(`✅ Successful Bookings: ${successful}`);
    console.log(`❌ Failed (Sold Out or Errors): ${failed}`);

    const ticketRes = await axios.get(`${API_URL}/tickets`);
    console.log(`🎫 Remaining Tickets in DB: ${ticketRes.data.available}`);

  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

runLoadTest();
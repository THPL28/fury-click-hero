import axios from 'axios';

async function testAPI() {
  const baseURL = 'http://localhost:3000/api';

  try {
    // Test 1: POST /jobs
    console.log('\n=== TEST 1: POST /api/jobs ===');
    const jobData = {
      target: 'test@example.com',
      type: 'email',
      payload: { message: 'Test job' }
    };

    const postResponse = await axios.post(`${baseURL}/jobs`, jobData, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Status:', postResponse.status);
    console.log('Response:', JSON.stringify(postResponse.data, null, 2));

    const jobId = postResponse.data.data?.jobId;
    console.log('Job ID:', jobId);

    if (jobId) {
      // Test 2: GET /jobs/:id
      console.log('\n=== TEST 2: GET /api/jobs/:id ===');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

      const getResponse = await axios.get(`${baseURL}/jobs/${jobId}`);
      console.log('Status:', getResponse.status);
      console.log('Response:', JSON.stringify(getResponse.data, null, 2));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error Status:', error.response?.status);
      console.error('Error Response:', error.response?.data);
    } else {
      console.error('Error:', error);
    }
  }

  process.exit(0);
}

testAPI();

import axios from 'axios';
async function run() {
  try {
    const res = await axios.post('http://localhost:4000/api/auth/initiate-2fa', { phone: '+919881925252' });
    console.log(JSON.stringify(res.data));
  } catch (err) {
    console.error(JSON.stringify(err.response?.data || { error: err.message }));
  }
}
run();

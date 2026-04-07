import axios from 'axios';
async function run() {
  try {
    const res = await axios.post('http://localhost:4000/api/auth/verify-2fa', { 
      phone: '+919881925252',
      otp: '408860'
    });
    console.log(JSON.stringify(res.data));
  } catch (err) {
    console.error(JSON.stringify(err.response?.data || { error: err.message }));
  }
}
run();

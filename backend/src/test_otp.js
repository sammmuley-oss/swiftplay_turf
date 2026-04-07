import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/auth';
const TEST_PHONE = '+919876543210';

async function testMobileOTP() {
  console.log('--- Testing Mobile OTP Flow ---');
  
  try {
    // 1. Initiate 2FA
    console.log(`\n1. Initiating 2FA for ${TEST_PHONE}...`);
    const initResp = await axios.post(`${BASE_URL}/initiate-2fa`, {
      phone: TEST_PHONE
    });
    
    console.log('Response:', initResp.data);
    
    if (initResp.data.type !== 'simulation') {
      console.log('Skipping verification as it\'s not in simulation mode.');
      return;
    }
    
    // Extract OTP from message (simulated)
    const otpMatch = initResp.data.message.match(/SIMULATED: (\d+)/);
    if (!otpMatch) {
      console.error('Failed to extract OTP from simulated message');
      return;
    }
    const otp = otpMatch[1];
    console.log(`Extracted OTP: ${otp}`);
    
    // 2. Verify 2FA
    console.log(`\n2. Verifying OTP ${otp} for ${TEST_PHONE}...`);
    const verifyResp = await axios.post(`${BASE_URL}/verify-2fa`, {
      phone: TEST_PHONE,
      otp: otp
    });
    
    console.log('Response:', verifyResp.data);
    
    if (verifyResp.data.token) {
      console.log('\n✅ Mobile OTP flow verified successfully!');
    } else {
      console.error('\n❌ Verification failed: No token returned');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
  }
}

testMobileOTP();

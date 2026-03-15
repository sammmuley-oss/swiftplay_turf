// IoT simulation module for locker control and sensing
// In production this would be replaced with real hardware integration.

export async function openLocker(lockerId) {
  console.log(`[IoT] Opening locker ${lockerId}`);
  await delay(500);
  return { success: true, lockerId };
}

export async function closeLocker(lockerId) {
  console.log(`[IoT] Closing locker ${lockerId}`);
  await delay(500);
  return { success: true, lockerId };
}

export async function verifyRFID(lockerId, rfidTag) {
  console.log(`[IoT] Verifying RFID for locker ${lockerId}: ${rfidTag}`);
  await delay(300);
  // In a real system this would consult hardware; here we just return true.
  return { success: true, lockerId, rfidTag };
}

export async function detectWeightChange(lockerId) {
  console.log(`[IoT] Detecting weight change for locker ${lockerId}`);
  await delay(300);
  // Simulate weight change detection.
  return { success: true, lockerId, deltaGrams: 500 };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


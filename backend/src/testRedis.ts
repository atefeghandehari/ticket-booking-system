import redis from './redisClient';

async function runTest() {
  try {
    await redis.set('system_status', 'active');
    const status = await redis.get('system_status');
    console.log(`STATUS: ${status}`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runTest();
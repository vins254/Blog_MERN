const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    const mongoUrl = process.env.MONGO_URL;
    
    if (!mongoUrl) {
        console.error('❌ Error: MONGO_URL not found in .env file.');
        process.exit(1);
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📡 URL (redacted): ${mongoUrl.substring(0, 20)}...`);

    try {
        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Success: Connected to MongoDB successfully.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:');
        console.error(err.message);
        console.log('\n🔍 Troubleshooting Tips:');
        console.log('1. Check if your current IP is whitelisted in MongoDB Atlas (Network Access).');
        console.log('2. Verify the username and password in your MONGO_URL.');
        console.log('3. Ensure your MongoDB Atlas cluster is active.');
        process.exit(1);
    }
}

testConnection();

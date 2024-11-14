import { MongoClient } from 'mongodb';

async function testMongoConnection() {
  // Replace with your MongoDB Atlas URI
  const uri =
    'mongodb+srv://ramona:AvB7pHRcayB5bAhS@skillbridge.lkt2i.mongodb.net/skillBridgeRwanda?retryWrites=true&w=majority&appName=skillBridge';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas!');

    // Test database operations
    const database = client.db('skillbridge');
    const collections = await database.listCollections().toArray();
    console.log(
      'Available collections:',
      collections.map((c) => c.name),
    );
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testMongoConnection();

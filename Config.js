import { MongoClient, ServerApiVersion } from "mongodb";

// Replace the placeholder with your Atlas connection string
const uri = "mongodb://127.0.0.1:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectToDatabase() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("myDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Propagate the error to the caller
  }
}

export async function closeConnection() {
  await client.close();
  console.log("Closed MongoDB connection");
}

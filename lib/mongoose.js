import mongoose from "mongoose";

export function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const uri = process.env.MONGODB_URI;
        return mongoose.connect(uri);
    }
}

// Background: mongoose is a library used to interact with MongoDB, a popular database system, from JavaScript applications. This library makes it easier to manage, validate, save, and retrieve data from MongoDB.

// The Function mongooseConnect: This function is designed to connect your application to a MongoDB database, but with some intelligence.

// mongoose.connection.readyState === 1: Mongoose keeps track of its connection status to MongoDB. A readyState of 1 means mongoose is already connected to MongoDB.

// return mongoose.connection.asPromise();: If mongoose is already connected to the database (as verified by the previous step), this line simply returns the existing connection. The .asPromise() method ensures that the connection is treated as a Promise, a special type of object in JavaScript used for handling asynchronous operations.

// const uri = process.env.MONGODB_URI;: If mongoose isn't already connected, then we need to establish a new connection. For this, we require the address (or URI) of the MongoDB server. This line retrieves that address, which is typically stored in a secure environment variable to keep it secret.

// return mongoose.connect(uri);: This is where mongoose is instructed to connect to the MongoDB server using the address we obtained in the previous step. If successful, this establishes a new connection to the database.

// In Simple Terms: Imagine you're trying to make a call to a friend (MongoDB in this analogy). The function mongooseConnect is like checking:

// If you're already on a call with your friend, continue the chat.
// If you're not on the call, dial your friend's number and start a new conversation.
// That's the essence of the mongooseConnect function: it ensures that you have an active "call" (connection) with the MongoDB server.
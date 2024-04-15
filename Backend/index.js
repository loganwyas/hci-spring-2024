const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");

const multer = require('multer');
const { default: mongoose } = require("mongoose");
const {ObjectId}=require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// PERSONALIZATION: For personalized envrionments you will need to update the next two lines to your personal data connections.
var CONNECTION_STRING = "mongodb+srv://harish:1234567890@cluster0.xbtdjvm.mongodb.net/?retryWrites=true&w=majority";
var DATABASESNAME = "nutrient-count";
var database;

// Move server initialization logic outside of app.listen
MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  } else {
    database = client.db(DATABASESNAME);
    console.log("Successfully connected to MongoDB");

    // Start the server
    server = app.listen(5038, () => {
      console.log("Server is running on port 5038");
    });

    // Close the MongoDB connection when the server is closed
    server.on('close', () => {
      console.log("Closing MongoDB connection");
      client.close();
    });
  }
});


// this get request is for login
app.get('/api/user/userBarrcode', (request, response) => {
  database.collection('UserData').find({ 
  }).toArray((error, result) => {
    if (error) {
      console.error('Error retrieving data from MongoDB:', error);
      response.status(500).send('Internal Server Error');
    } else {
      // Send the result as a response
      response.send(result);
    }
  });
});

// this post request is for signin
app.post('/api/user/userdata', multer().none(), (request, response) => {
    database.collection("UserData").countDocuments({}, (error, numofDocs) => {
        if (error) {
            console.error("Error counting documents:", error);
            response.status(500).send("Internal Server Error");
        } else {
            const body = request.body;

            database.collection("UserData").insertOne(body, (insertError) => {
                if (insertError) {
                    console.error("Error adding :", insertError);
                    response.status(500).send("Internal Server Error");
                } else {
                    console.log(body);
                    response.json(" added successfully");
                }
            });
        }
    });
});



  module.exports = app;
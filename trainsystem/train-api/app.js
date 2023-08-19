const express = require("express");
const axios = require("axios");
const app = express();
const port = 3001; // You can choose any port you prefer
const cors = require("cors");

app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Register your company and obtain credentials (you should do this only once)
// Replace with your actual registration details
const clientID = "c5dc17b1-e864-4987-8523-0cd2d7d0116f";
const clientSecret = "AsCNeGzZKpmgINTk";
const accessToken = "hMkCJZ"; // Store your access token securely

// Define API endpoints

app.get("/", (req, res) => {
  res.send("Welcome to the Train API");
});


// Get the list of trains for the next 12 hours
app.get("http://localhost:3001/train/trains", async (req, res) => {
  try {
    const trains = await fetchTrains();
    const filteredTrains = filterTrains(trains);
    const sortedTrains = sortTrains(filteredTrains);
    res.json(sortedTrains);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch train data from John Doe Railway Server
async function fetchTrains() {
  const response = await axios.get("http://20.244.56.144:3001/train/trains", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

// Filter trains based on your requirements
function filterTrains(trains) {
  const now = new Date();
  const twelveHoursLater = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours in milliseconds
  return trains.filter((train) => {
    const departureTime = new Date(
      train.departureTime.Hours * 3600000 +
        train.departureTime.Minutes * 60000 +
        train.departureTime.Seconds * 1000
    );
    return departureTime > now && departureTime <= twelveHoursLater;
  });
}

// Sort trains based on your requirements
function sortTrains(trains) {
  return trains.sort((a, b) => {
    // Sort by price (ascending), seats available (descending), and departure time (descending)
    if (a.price.sleeper + a.price.AC !== b.price.sleeper + b.price.AC) {
      return a.price.sleeper + a.price.AC - b.price.sleeper + b.price.AC;
    }
    if (
      a.seatsAvailable.sleeper + a.seatsAvailable.AC !==
      b.seatsAvailable.sleeper + b.seatsAvailable.AC
    ) {
      return (
        b.seatsAvailable.sleeper +
        b.seatsAvailable.AC -
        a.seatsAvailable.sleeper +
        a.seatsAvailable.AC
      );
    }
    return (
      new Date(
        b.departureTime.Hours * 3600000 +
          b.departureTime.Minutes * 60000 +
          b.departureTime.Seconds * 1000
      ) -
      new Date(
        a.departureTime.Hours * 3600000 +
          a.departureTime.Minutes * 60000 +
          a.departureTime.Seconds * 1000
      )
    );
  });
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

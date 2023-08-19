import React, { useEffect, useState } from "react";
import axios from "axios";


function TrainList() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    // Make a GET request to your API endpoint
    axios
      .get("http://localhost:3001/train/trains")
      .then((response) => {
        console.log(response.data);
        setTrains(response.data);
      })
      .catch((error) => {
        console.error("Error fetching train data", error);
      });
  }, []);

  // Render the train data in your component
  return (
    <div>
      <h1>Train List</h1>
      <ul>
        {trains.map((train, index) => (
          <li key={index}>
            {train.trainName} - Departure Time: {train.departureTime.Hours}:
            {train.departureTime.Minutes}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrainList;

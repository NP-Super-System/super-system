const express = require("express");
const rewardModel = require("../models/reward/Reward");
const app = express();

// Read rewards
app.get("/rewards", async (request, response) => {
  const rewards = await rewardModel.find({});

  try {
    response.send(rewards);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Create rewards
app.post("/reward", async (request, response) => {
    const reward = new rewardModel(request.body);
  
    try {
      await reward.save();
      response.send(reward);
    } catch (error) {
      response.status(500).send(error);
    }
  });

// Update rewards
app.patch("/reward/:id", async (request, response) => {
    try {
      await rewardModel.findByIdAndUpdate(request.params.id, request.body);
      await rewardModel.save();
      response.send(reward);
    } catch (error) {
      response.status(500).send(error);
    }
  });
  
// Delete rewards
app.delete("/reward/:id", async (request, response) => {
    try {
      const reward = await rewardModel.findByIdAndDelete(request.params.id);
  
      if (!reward) response.status(404).send("No item found");
      response.status(200).send();
    } catch (error) {
      response.status(500).send(error);
    }
  });
  


module.exports = app;
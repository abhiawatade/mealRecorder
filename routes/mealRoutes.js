const express = require("express");
const { where } = require("sequelize");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const User = require("../models/userModel");
const { route } = require("./userRoutes");
const APP_ID = "b44e99fc";
const APP_KEY = "fe365d1a95231582d00f18ca548a3424 —";
const Meal = require("../models/mealModel");
const axios = require("axios");
const { isAdmin } = require("../middlewares/auth");
const { isUser } = require("../middlewares/auth");

router.post("/meals", async (req, res) => {
  // Extract the meal name and time from the request body
  const { name, time } = req.body;

  try {
    // Call the Nutritionix API to fetch the calories for the meal
    const response = await axios.get(
      `https://api.nutritionix.com/v1_1/search/${name}?results=0:1&fields=item_name,nf_calories&appId=${APP_ID}&appKey=${APP_KEY}`
    );

    const { hits } = response.data;
    if (hits && hits.length > 0) {
      const { fields } = hits[0];
      if (fields) {
        const { nf_calories } = fields;
        // Create a new Meal with the name, time, and calories
        const meal = await Meal.create({
          name,
          time,
          calories: nf_calories,
        });
        res.status(201).json({ message: "Meal added successfully", meal });
      }
    } else {
      // Create a new Meal with the name, time, and default calories
      const meal = await Meal.create({
        name,
        time,
      });
      res.status(201).json({ message: "Meal added successfully", meal });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch calories from Nutritionix API" });
  }
});
router.get("/meals", (req, res) => {
  // Retrieve all meals from the database
  Meal.findAll()
    .then((meals) => {
      // Return the meals in the response
      res.json({ meals });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to retrieve meals" });
    });
});

router.put("/meals/:id", (req, res) => {
  // Extract the meal ID from the URL
  const { id } = req.params;

  // Extract the updated meal information from the request body
  const { name, time, calories } = req.body;

  // Update the meal in the database
  Meal.update({ name, time, calories }, { where: { id } })
    .then((result) => {
      if (result[0] === 1) {
        // Meal updated successfully
        Meal.findByPk(id)
          .then((updatedMeal) => {
            res
              .status(200)
              .json({ message: "Meal updated successfully", updatedMeal });
          })
          .catch((err) => {
            res.status(500).json({ error: "Failed to retrieve updated meal" });
          });
      } else {
        // No meals were updated
        res.status(404).json({ error: "Meal not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update meal" });
    });
});

module.exports = router;

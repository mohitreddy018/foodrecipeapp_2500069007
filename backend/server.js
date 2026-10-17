
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Recipe = require("./models/Recipe");
const RecipeSubmission = require("./models/RecipeSubmission");
const authRoutes = require("./auth/authRoutes");
const { verifyToken, adminOnly } = require("./auth/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) =>
    console.error("MongoDB connection failed:", error.message)
  );

// Home
app.get("/", (req, res) => {
  res.json({ message: "Food Recipe API is running!" });
});

// Get all public recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    res.json(recipes);
  } catch (error) {
    console.error("Fetch recipes error:", error);
    res.status(500).json({ message: "Error fetching recipes." });
  }
});

// Get one public recipe
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: "Invalid recipe ID." });
  }
});

// Admin: add a public recipe
app.post("/api/recipes", verifyToken, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);

    res.status(201).json({
      message: "Recipe added successfully!",
      recipe
    });
  } catch (error) {
    console.error("Add recipe error:", error);
    res.status(400).json({
      message: "Could not add recipe. Check the submitted details."
    });
  }
});

// Admin: edit a public recipe
app.put("/api/recipes/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.json({
      message: "Recipe updated successfully!",
      recipe
    });
  } catch (error) {
    console.error("Update recipe error:", error);
    res.status(400).json({ message: "Could not update recipe." });
  }
});

// Admin: delete a public recipe
app.delete("/api/recipes/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.json({ message: "Recipe deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Could not delete recipe." });
  }
});

// User: submit a recipe for review
app.post("/api/submissions", verifyToken, async (req, res) => {
  try {
    const {
      name,
      image,
      imageSource,
      category,
      cuisine,
      area,
      description,
      dietaryPreference,
      ingredients,
      instructions,
      rating,
      cookingTime,
      serving,
      difficulty
    } = req.body;

    if (
      !name ||
      !category ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0 ||
      !Array.isArray(instructions) ||
      instructions.length === 0
    ) {
      return res.status(400).json({
        message: "Name, category, ingredients and instructions are required."
      });
    }

    const submission = await RecipeSubmission.create({
      name,
      image: image || "",
      imageSource: imageSource || "",
      category,
      cuisine: cuisine || "",
      area: area || "",
      description: description || "",
      dietaryPreference: dietaryPreference || "Vegetarian",
      ingredients,
      instructions,
      rating: rating || 0,
      cookingTime: cookingTime || 0,
      serving: serving || 1,
      difficulty: difficulty || "Medium",
      submittedBy: req.user._id,
      status: "pending"
    });

    res.status(201).json({
      message: "Recipe submitted for admin approval!",
      submission
    });
  } catch (error) {
    console.error("Submit recipe error:", error);
    res.status(400).json({ message: "Could not submit recipe." });
  }
});

// Admin: view submitted recipes
app.get(
  "/api/submissions",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const submissions = await RecipeSubmission.find()
        .populate("submittedBy", "name email")
        .sort({ createdAt: -1 });

      res.json(submissions);
    } catch (error) {
      console.error("Fetch submissions error:", error);
      res.status(500).json({ message: "Could not fetch submissions." });
    }
  }
);

// Admin: approve a submitted recipe
app.patch(
  "/api/submissions/:id/approve",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const submission = await RecipeSubmission.findById(req.params.id);

      if (!submission) {
        return res.status(404).json({ message: "Submission not found." });
      }

      if (submission.status !== "pending") {
        return res.status(400).json({
          message: "This submission has already been reviewed."
        });
      }

      const recipeData = submission.toObject();
      delete recipeData._id;
      delete recipeData.__v;
      delete recipeData.submittedBy;
      delete recipeData.status;
      delete recipeData.createdAt;
      delete recipeData.updatedAt;

      const recipe = await Recipe.create(recipeData);

      submission.status = "approved";
      await submission.save();

      res.json({
        message: "Submission approved and recipe published!",
        recipe,
        submission
      });
    } catch (error) {
      console.error("Approve submission error:", error);
      res.status(400).json({ message: "Could not approve submission." });
    }
  }
);

// Admin: reject a submitted recipe
app.patch(
  "/api/submissions/:id/reject",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const submission = await RecipeSubmission.findById(req.params.id);

      if (!submission) {
        return res.status(404).json({ message: "Submission not found." });
      }

      if (submission.status !== "pending") {
        return res.status(400).json({
          message: "This submission has already been reviewed."
        });
      }

      submission.status = "rejected";
      await submission.save();

      res.json({
        message: "Submission rejected.",
        submission
      });
    } catch (error) {
      console.error("Reject submission error:", error);
      res.status(400).json({ message: "Could not reject submission." });
    }
  }
);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

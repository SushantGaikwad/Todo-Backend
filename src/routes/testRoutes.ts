import express from "express";
import UserModel from "../models/User.model";
import TodoModel from "../models/Todo.model";
const router = express.Router();

// Cleanup test data (delete user and their todos by email)
router.delete("/cleanup", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    await UserModel.deleteOne({ email });
    await TodoModel.deleteMany({ user: email }); // Assuming todos are linked to user email
    res.status(200).json({ message: "Test data cleaned up" });
  } catch (error) {
    res.status(500).json({ message: "Cleanup failed", error });
  }
});

export default router;

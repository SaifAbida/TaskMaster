import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, "The title is required"] },
  content: { type: String, required: [true, "The content is required"] },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, "The username is required"] },
  email: { type: String, required: [true, "The email is required"] },
  password: { type: String, required: [true, "The password is required"] },
  posts: [postSchema],
});

export const User = mongoose.model("User", userSchema);

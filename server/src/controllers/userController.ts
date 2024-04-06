import { User } from "../module/blogmodule";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthentificatedRequest } from "../AuthentificatedRequest/AuthentificatedRequest";

export class Authentificate {
  static async register(req: Request, res: Response) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const newUser = new User({
        ...req.body,
        password: hash,
      });
      const savedUser = await newUser.save();
      res.status(201).send(savedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
        return res.status(401).send("Error credentials");
      }
      const verifyPassword = bcrypt.compareSync(
        password,
        existingUser.password
      );
      if (!verifyPassword) {
        return res.status(401).send("Error credentials");
      }
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.TOKEN_SECERT_KEY,
        { expiresIn: "24h" }
      );
      res.status(200).send({
        message: `Welcome ${existingUser.username}`,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }
}

export class UpdateAccount {
  static async getAccount(req: AuthentificatedRequest, res: Response) {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }
  static async updateAccount(req: AuthentificatedRequest, res: Response) {
    try {
      const updatingAccount = await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true }
      );
      res.status(201).send(updatingAccount);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }
  static async passwordReset(req: AuthentificatedRequest, res: Response) {
    try {
      const { currentPassword,password, confirmPassword } = req.body;
      let user = await User.findById(req.user.id);
      const oldPassword = bcrypt.compareSync(currentPassword,user.password)
      if(!oldPassword){
        return res.status(400).send("Your current password is incorrect");
      }
      const samePassword = bcrypt.compareSync(password, user.password);
      if (samePassword) {
        return res.status(400).send("Bad Request");
      }
      if (password !== confirmPassword) {
        return res
          .status(400)
          .send("Password and confirm password are not matching");
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      user.password = hash;
      await user.save();
      res.status(201).send("Password Changed successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }
}

export class ManageBlog {
  static async createPost(req: AuthentificatedRequest, res: Response) {
    try {
      const user = await User.findById(req.user.id);
      user.posts.push(req.body);
      await user.save();
      res.status(201).send(user.posts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }
  static async updatePost(req: AuthentificatedRequest, res: Response) {
    try {
      const user = await User.findById(req.user.id);
      const postToUpdate = user.posts.id(req.params.id);
      if (!postToUpdate) {
        return res.status(404).send("Post not found");
      }
      postToUpdate.title = req.body.title;
      postToUpdate.content = req.body.content;
      await user.save();
      res.status(200).send(user.posts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }
  static async deletePost(req: AuthentificatedRequest, res: Response) {
    try {
      let user = await User.findById(req.user.id);
      user.posts.id(req.params.id).deleteOne();
      await user.save();
      res.status(200).send(user.posts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }

  static async getPosts(req: AuthentificatedRequest, res: Response) {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).send(user.posts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }

  static async getPost(req: AuthentificatedRequest, res: Response) {
    try {
      const user = await User.findById(req.user.id);
      const post = user.posts.id(req.params.id);
      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }
}

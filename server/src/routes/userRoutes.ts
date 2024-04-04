import { VerifyLogin } from "../middleware/verifyLogin";
import {
  Authentificate,
  ManageBlog,
  UpdateAccount,
} from "../controllers/userController";
import express from "express";

const router = express.Router();

// AUTHENTIFICATE :

router.post("/create", Authentificate.register);
router.post("/login", Authentificate.login);

// MANAGE ACCOUNT :

router.patch("/update", VerifyLogin.verifyLogin, UpdateAccount.updateAccount);
router.patch("/reset", VerifyLogin.verifyLogin, UpdateAccount.passwordReset);
router.get("/user",VerifyLogin.verifyLogin, UpdateAccount.getAccount)
router.get("/", VerifyLogin.verifyLogin, ManageBlog.getPosts);
router.post("/", VerifyLogin.verifyLogin, ManageBlog.createPost);
router.put("/:id", VerifyLogin.verifyLogin, ManageBlog.updatePost);
router.delete("/:id", VerifyLogin.verifyLogin, ManageBlog.deletePost);
router.get("/:id", VerifyLogin.verifyLogin, ManageBlog.getPost);


export default router

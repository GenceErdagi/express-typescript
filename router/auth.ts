import express, { Router } from "express";
import {
  register,
  getUser,
  login,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  editDetails,
} from "../controllers/auth";
import { getAccessToRoute } from "../middlewares/auth/auth";
import profileImageUpload from "../middlewares/libraries/profileImageUpload";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post(
  "/upload",
  [getAccessToRoute, profileImageUpload.single("profile_image")],
  imageUpload
);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/edit", getAccessToRoute, editDetails);
router.get("/profile", getAccessToRoute, getUser);
router.get("/logout", getAccessToRoute, logout);

export default router;

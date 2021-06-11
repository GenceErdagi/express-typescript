import express from "express";
import { getAccessToRoute, getAdminAccess } from "../middlewares/auth/auth";
import { blockUser,deleteUser } from "../controllers/admin";
import { checkUserExist } from "../middlewares/database/databaseErrorHelpers";
const router = express.Router();

router.use([getAccessToRoute, getAdminAccess]);

router.get("/block/:id",checkUserExist,blockUser);
router.delete("/delete/:id",checkUserExist,deleteUser);

export default router;

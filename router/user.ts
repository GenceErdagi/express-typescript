import express from "express";
import {getSingleUser,getAllUsers} from "../controllers/user";
import {checkUserExist} from "../middlewares/database/databaseErrorHelpers"
const router = express.Router();

router.get("/",getAllUsers)
router.get("/:id",checkUserExist,getSingleUser)

export default router;
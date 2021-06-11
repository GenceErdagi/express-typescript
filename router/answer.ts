import express from "express";
import {
  getAccessToRoute,
  getAnswerOwnerAccess,
} from "../middlewares/auth/auth";
import {
  addNewAnswerToQuestion,
  getAllAnswersFoQuestion,
  getSingleAnswer,
  updateSingleAnswer,
} from "../controllers/answer";
import { checkAnswerExist } from "../middlewares/database/databaseErrorHelpers";

const router = express.Router({ mergeParams: true });

router.post("/", getAccessToRoute, addNewAnswerToQuestion);
router.get("/", getAllAnswersFoQuestion);
router.get("/:answer_id", checkAnswerExist, getSingleAnswer);
router.get(
  "/:answer_id",
  [checkAnswerExist, getAnswerOwnerAccess],
  updateSingleAnswer
);

export default router;

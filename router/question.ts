import express from "express";
import {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
} from "../controllers/question";
import {
  getAccessToRoute,
  getQuestionOwnerAccess,
} from "../middlewares/auth/auth";
import { checkQuestionExist } from "../middlewares/database/databaseErrorHelpers";
import answer from "./answer";

const router = express.Router();
router.get("/", getAllQuestions);
router.get("/:id", checkQuestionExist, getSingleQuestion);
router.post("/ask", getAccessToRoute, askNewQuestion);
router.put(
  "/:id/edit",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
router.delete(
  "/:id/delete",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestion
);
router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion);
router.get(
  "/:id/undolike",
  [getAccessToRoute, checkQuestionExist],
  undoLikeQuestion
);
router.use("/:question_id/answers", checkQuestionExist ,answer);


export default router;

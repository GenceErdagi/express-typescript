import express from 'express';
import question from './question'
import auth from './auth'
import user from "./user"
import admin from "./admin"


const routers = express.Router();


routers.use("/questions", question);
routers.use("/auth", auth);
routers.use("/user",user);
routers.use("/admin",admin);


export default routers;
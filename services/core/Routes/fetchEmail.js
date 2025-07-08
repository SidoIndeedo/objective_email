const express = require("express");
const auth = require("../middleware/auth");
const emails = require("../controller/emails");

const emailRouter = express.Router();


emailRouter.use(auth.jwtMolestor);

emailRouter.get("/fix-my-problems", emails.all);


module.exports = emailRouter;
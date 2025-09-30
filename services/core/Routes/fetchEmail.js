const express = require("express");
const auth = require("../middleware/auth");
const emails = require("../controller/emails");

const emailRouter = express.Router();


emailRouter.use(auth.jwtMolestor);

emailRouter.get("/all", emails.all);
emailRouter.delete("/delete/all", emails.deleteAllEmailsForUser)
emailRouter.delete("/delete/:id", emails.deleteEmail)


module.exports = emailRouter;
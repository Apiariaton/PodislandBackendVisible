const express = require('express');
const userFunctionsRouter = new express.Router();

//Sub-routers
const userCreationLogRouter = require('./LoginLogout/UserCreationLog');
const forgotPasswordRouter = require('./ForgotPassword/ForgotPassword');







//Directing routers to parent router
userFunctionsRouter.use(userCreationLogRouter);
userFunctionsRouter.use(forgotPasswordRouter);





module.exports = userFunctionsRouter;




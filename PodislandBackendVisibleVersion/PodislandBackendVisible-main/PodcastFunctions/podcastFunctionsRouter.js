const express = require('express');
const podcastFunctionsRouter = new express.Router();
const togglePodPrefRouter = require("./ToggleLikePod/togglePodPrefRouter");
const OrderCreationLogRouter = require("./CancelPlaceOrder/OrderCreationLog");
const filterPodsShopItemsRouter = require("./FilterPodShopData/filterPodShopData");


podcastFunctionsRouter.use(togglePodPrefRouter);
podcastFunctionsRouter.use(OrderCreationLogRouter);
podcastFunctionsRouter.use(filterPodsShopItemsRouter);








module.exports = podcastFunctionsRouter;
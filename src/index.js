const express = require('express');
require('dotenv').config();

const webApp = express();

webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

const PORT = process.env.PORT || 5000;

const homeRoute = require('../route/home_route');
const dialogflowRoute = require('../route/dialogflow_route');
const websiteRoute = require('../route/website_route');

webApp.use(homeRoute.router);
webApp.use(dialogflowRoute.router);
webApp.use(websiteRoute.router);

webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});
const express = require('express');
const router = express.Router();

const DIALOGFLOW_API = require('../helper/dialogflow_api');
const UTIL = require('../controller/util');

router.post('/website', async (req, res) => {

    console.log('A new request came at website.');
    console.log(req.body);

    let query = req.body.query;
    let sessionId = req.body.sessionId;

    let intentData = await DIALOGFLOW_API.detectIntent('en', query, sessionId);

    if (intentData.status == 1) {
        try {
            let fulfillmentText = JSON.parse(intentData.fulfillmentText);
            fulfillmentText['status'] = 1;
            res.send(fulfillmentText);
        } catch (error) {
            let fulfillmentText = {
                'messages': [intentData.fulfillmentText],
                'buttons': [],
                'status': 1
            };
            res.send(fulfillmentText);
        }
    } else {
        let fulfillmentText = {};
        fulfillmentText['status'] = 0;
        res.send(fulfillmentText)
    }
});

module.exports = {
    router
};
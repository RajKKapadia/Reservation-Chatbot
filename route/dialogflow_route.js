const express = require('express');
const router = express.Router();

const CONTROLLERS = require('../controller/export_controllers');

router.post('/dialogflow', async (req, res) => {

    let action = req.body.queryResult.action;

    if (action === 'handleUserInfo') {
        let responseData = CONTROLLERS.handleReservation.manageUserInfo(req);
        res.send(responseData);
    } else if (action === 'handleInsertAppointment') {
        let responseData = await CONTROLLERS.handleReservation.insertUserInfo(req);
        res.send(responseData);
    } else if (action === 'handleUserDeniesChanges') {
        let responseData = CONTROLLERS.handleReservation.userDeniesChanges(req);
        res.send(responseData);
    }
    else {
        let responseData = CONTROLLERS.util.formatResponseForDialogflow(
            [
                `There is no response set for the action ${action}`
            ],
            [],
            []
        );
        res.send(responseData)
    }

});

module.exports = {
    router
};
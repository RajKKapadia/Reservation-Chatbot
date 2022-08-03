const UTIL = require('./util');
const AIRTABLE_API = require('../helper/airtable_api');

const manageUserInfo = (req) => {

    let session = req.body.session;
    let outputContexts = req.body.queryResult.outputContexts;

    let person, mobile, dateTime;

    outputContexts.forEach((oc) => {
        if (oc.name.includes('contexts/session')) {
            if (oc.hasOwnProperty('parameters')) {
                let parameters = oc.parameters;
                try {
                    person = parameters.person.name;
                    mobile = parameters.mobile;
                    dateTime = parameters.dateTime.date_time;
                } catch (error) {}
            }
        }
    });

    if (person === undefined) {
        let oc = [
            {
                name: `${session}/contexts/await_name`,
                lifespanCount: 1
            }
        ];
        return UTIL.formatResponseForDialogflow(
            [
                'Hello, welcome to the Appointment Assistant chatbot.',
                'May I know your name to get started?'
            ],
            [],
            oc
        );
    }
    if (mobile === undefined) {
        let oc = [
            {
                name: `${session}/contexts/await_mobile`,
                lifespanCount: 1
            }
        ];
        return UTIL.formatResponseForDialogflow(
            [
                `Thank you ${person}...`,
                'What is the best number to reach you?'
            ],
            [],
            oc
        );
    }
    if (dateTime === undefined) {
        let oc = [
            {
                name: `${session}/contexts/await_datetime`,
                lifespanCount: 1
            }
        ];
        return UTIL.formatResponseForDialogflow(
            [
                'Finally...',
                'What day and time you want to schedule a visit?'
            ],
            [],
            oc
        );
    }

    let formatedDatetime = UTIL.handleDatetimefromDialogflow(dateTime);

    let oc = [
        {
            name: `${session}/contexts/await_confirm_reservation`,
            lifespanCount: 1
        }
    ];

    person = person.charAt(0).toUpperCase() + person.slice(1);

    return UTIL.formatResponseForDialogflow(
        [
            'Here is the summary of your bookings...',
            `Your booking in the name of ${person}, mobile number ${mobile} on ${formatedDatetime.dateTimeToString}`,
            'Do you confirm the details?'
        ],
        [
            'Yes',
            'No'
        ],
        oc
    );
};

const insertUserInfo = async (req) => {

    let session = req.body.session;
    let outputContexts = req.body.queryResult.outputContexts;

    let person, mobile, dateTime;

    outputContexts.forEach((oc) => {
        if (oc.name.includes('contexts/session')) {
            if (oc.hasOwnProperty('parameters')) {
                let parameters = oc.parameters;
                try {
                    person = parameters.person.name;
                    mobile = parameters.mobile;
                    dateTime = parameters.dateTime.date_time;
                } catch (error) {}
            }
        }
    });

    let formatedDatetime = UTIL.handleDatetimefromDialogflow(dateTime);

    let result = await AIRTABLE_API.createNewRecord(
        {
            name: person,
            mobile: `${mobile}`,
            dateTime: formatedDatetime.date,
            dateTimeString: formatedDatetime.dateTimeToString,
            createdAt: new Date(Date.now()),
            isEnded: 0
        },
        'Reservations'
    );

    if (result.status == 1) {
        let oc = [
            {
                name: `${session}/contexts/session`,
                lifespanCount: 0
            }
        ];
        return UTIL.formatResponseForDialogflow(
            [
                'Your bookings are confirmed.',
                'See you soon...',
                'Is there anything I can help you with?'
            ],
            [
                'Schedule a visit'
            ],
            oc
        );
    } else {
        return UTIL.getErrorMessage();
    }
};

const userDeniesChanges = (req) => {

    let session = req.body.session;

    let oc = [
        {
            name: `${session}/contexts/session`,
            lifespanCount: 0
        }
    ];
    return UTIL.formatResponseForDialogflow(
        [
            'This is okay...',
            'Is there anything I can help you with?'
        ],
        [
            'Schedule a visit'
        ],
        oc
    );
};

module.exports = {
    manageUserInfo,
    insertUserInfo,
    userDeniesChanges
};
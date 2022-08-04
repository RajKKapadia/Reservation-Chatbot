const formatResponseForDialogflow = (messages, buttons, oc) => {

    fulfillmentText = {}

    fulfillmentText['messages'] = messages;
    fulfillmentText['buttons'] = buttons;

    let responseData = {
        fulfillmentText: JSON.stringify(
            fulfillmentText
        )
    };

    if (oc !== []) {
        responseData['outputContexts'] = oc;
    }

    return responseData
};

const getErrorMessage = () => {

    return formatResponseForDialogflow(
        [
            'We are facing a technical issue.',
            'Please try after sometimes or contact the XYZ restaurant.'
        ],
        ['Schedule a visit', 'Request a callback'],
        []
    );
};

const handleDatetimefromDialogflow = (dateTime) => {
    
    let year = dateTime.split('T')[0].split('-')[0];
    let month = dateTime.split('T')[0].split('-')[1];
    let day = dateTime.split('T')[0].split('-')[2];

    let hours = dateTime.split('T')[1].split(':')[0];
    let minutes = dateTime.split('T')[1].split(':')[1];

    date = new Date(year, month - 1, day, hours, minutes);

    let dateToString = date.toDateString('in', { year: 'numeric', month: 'long', timeZone: 'ist' });

    let timeToString = date.toLocaleTimeString('in', { hour: '2-digit', minute: '2-digit', hour12: true });

    let dateTimeToString = `${dateToString} at ${timeToString}`;

    return {
        date,
        dateTimeToString
    };
};

module.exports = {
    formatResponseForDialogflow,
    getErrorMessage,
    handleDatetimefromDialogflow
};
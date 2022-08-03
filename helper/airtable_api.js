const axios = require('axios');
require('dotenv').config();

const APIKEY = process.env.API_KEY;
const APPID = process.env.APP_ID;

const createNewRecord = async (fields, tableName) => {

    url = `https://api.airtable.com/v0/${APPID}/${tableName}`;
    headers = {
        'Authorization': 'Bearer ' + APIKEY,
        'Content-Type': 'application/json'
    }

    try {
        let response = await axios.post(url, { fields }, { headers });
        if (response.status == 200) {
            return {
                status: 1
            };
        } else {
            return {
                status: 0
            };
        }
    } catch (error) {
        console.log(`Error at createNewRecord --> ${error}`);
        return {
            status: 2
        };
    }
};

module.exports = {
    createNewRecord
};
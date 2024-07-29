var unirest = require("unirest");

const sendSMS = ({ message = "", numbers = "" }) => new Promise((resolve, reject => {
    var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
    req.query({
        "authorization": "YOUR_API_KEY",
        "message": "This is a test message",
        "language": "english",
        "route": "q",
        "numbers": "9999999999,8888888888,7777777777",
    });

    req.headers({
        "authorization": process.env.SMS_API_KEY
    });
    req.form({
        "message": message,
        "language": "english",
        "route": "q",
        "numbers": numbers
    })


    req.end(function (res) {
        if (res.error) {
            console.log(res.error)
            reject(res.error)
        }

        console.log(res.body)
        resolve(true)
    });
}))




// Quick SMS Route Success Response:
// {
//     "return": true,
//     "request_id": "lwdtp7cjyqxvfe9",
//     "message": [
//         "Message sent successfully"
//     ]
// }
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const workflow = require('./workflow');

const dotenv = require('dotenv');
dotenv.config()

let app = express();
app.use(bodyParser.json());
const port = process.env.VCAP_APP_PORT || 5000;
let orderID = '';

app.post('/welcome', (req, res) => {
    res.send({
        replies: [{
            type: 'text',
            content: "Hi ADR" 
        }],
        conversation: {
            memory: {
                userID: 'C01',
                userName: 'Anupam'
            }
        }
    });
});

app.post('/createso', (req, res) => {
    let productID = req.body.conversation.memory.v_prodid.raw;
    let customerID = req.body.conversation.memory.userID;
    let index = req.body.conversation.memory.prod_disp.findIndex(el => el.ID == productID);
    // console.log(index);
    // console.log(req.body.conversation.memory.prod_disp);
    let unitPrice = req.body.conversation.memory.prod_disp[index].price;

    
    var options = {
    'method': 'POST',
    'url': 'https://469b9a7atrial-dev-wfsostaging-srv.cfapps.us10.hana.ondemand.com/catalog/SalesOrders',
    'headers': {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "customerID": customerID,
        "productID": productID,
        "quantity": 1,
        "unitPrice": unitPrice
    })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        //console.log(response);
        orderID = response.body.ID;
        res.send({
            replies: [{
                type: 'text',
                content: "Order created" 
            }],
            conversation: {
                memory: {
                    orderID: JSON.parse(response.body).ID
                }
            }
        });

        var context_data = JSON.stringify({
            "definitionId": "wfso_execute",
            "context": {
                "ID": JSON.parse(response.body).ID, //"d411bd9f-6134-456d-b312-c78b14ff0bfd",
                "customerID": JSON.parse(response.body).customerID, //"C01",
                "productID": JSON.parse(response.body).productID, //"Laptop-09",
                "quantity": JSON.parse(response.body).quantity,
                "unitPrice": JSON.parse(response.body).unitPrice
            }
        });
        workflow.trigger_wf(context_data);
    });

    
});

app.get('/test', (req, res) => {
    console.log(process.env.HANACRED);
    res.send(process.env.HANACRED+' '+process.env.TEST);
});
app.listen(port, () => {
    console.log('Server is running on port ', port);
})
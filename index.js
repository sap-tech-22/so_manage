const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const workflow = require('./workflow');
const validate = require('uuid-validate');

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


app.post('/sostatus', (req, res) => {
    

    // console.log(validate('49498b38-0202-45e3-ae77-9426213bf101'));
    // console.log(validate('d411bd9f-6134-456d-b312-c78b14ff0bfd'));
    // return;
    let ordID = req.body.conversation.memory.v_ordid.raw;
    // const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    // console.log(regexExp.test(ordID));

    if (validate(ordID)) {
        const option = {
            'method': 'GET',
            'url': 'https://469b9a7atrial-dev-wfsostaging-srv.cfapps.us10.hana.ondemand.com/catalog/OrderStatus(ID=' + ordID + ')',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'ID': ordID, //'d411bd9f-6134-456d-b312-c78b14ff0bfd',
            })
        };

        request(option, (error, response) => {
            if (error) throw new Error(error);
            console.log(response.body);
            let conv_out = req.body.conversation;
            conv_out.memory.statusText = JSON.parse(response.body).value.text;
            res.send({
                replies: [{
                    type: 'text',
                    content: "Status Received"
                }],
                conversation: conv_out
            });

        });
    } else {
        let conv_out_fail = req.body.conversation;
        conv_out_fail.memory.statusText = ordID + ' is not valid.';
        res.send({
            replies: [{
                type: 'text',
                content: "Status Received"
            }],
            conversation: conv_out_fail
        });
    }

});

app.post('/createso', (req, res) => {
    // console.log('data' + req.data);
    // console.log('-------------');
    console.log(req.body);
    console.log(typeof (req.body.conversation));
    let productID = '';
    let customerID = '';
    let quantity = 0;
    let unitPrice = 0;
    if (typeof (req.body.conversation) !== 'undefined') {
        // if (1 == 2) {    
        productID = req.body.conversation.memory.v_prodid.raw;
        customerID = req.body.conversation.memory.userID;

        if (req.body.conversation.memory.quantity == null) {
            quantity = 1;
        } else {
            quantity = req.body.conversation.memory.quantity;
        }
        let index = req.body.conversation.memory.prod_disp.findIndex(el => el.ID == productID);
        // console.log(index);
        // console.log(req.body.conversation.memory.prod_disp);
        unitPrice = req.body.conversation.memory.prod_disp[index].price;
    } else {
        productID = req.body.productID;
        customerID = req.body.customerID;
        quantity = req.body.quantity;
        unitPrice = req.body.price;
    }

    var options = {
        'method': 'POST',
        'url': 'https://469b9a7atrial-dev-wfsostaging-srv.cfapps.us10.hana.ondemand.com/catalog/SalesOrders',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "customerID": customerID,
            "productID": productID,
            "quantity": quantity,
            "unitPrice": unitPrice
        })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        //console.log(response);
        orderID = response.body.ID;

        if (typeof (req.body.conversation) !== 'undefined') {
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
        } else {
            res.send({
                id: JSON.parse(response.body).ID
            });
        }

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
    res.send(process.env.HANACRED + ' ' + process.env.TEST);
});
app.listen(port, () => {
    console.log('Server is running on port ', port);
})
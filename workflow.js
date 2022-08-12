const axios = require('axios')
const qs = require('querystring');

function trigger_wf(context_data) {
    const data = {
        'grant_type': 'client_credentials'
    };
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: process.env.TOKEN_CLIENT_ID,// 'sb-clone-b9a38ddf-65be-4ef7-8649-b74825106d7c!b96894|workflow!b1774',
            password: process.env.TOKEN_CLIENT_SECRET, //'3b518da2-f814-4da6-a628-990a97d8771d$njxeurGu9hpQ_iB0rZEfIG6RZdJUNNngzRVhVGnxPRU=',
        },
        data: qs.stringify(data),
        url: process.env.TOKEN_URL, //'https://469b9a7atrial.authentication.us10.hana.ondemand.com/oauth/token',
    }
    
    axios.request(options).then(function (res) {
        console.log(res.data.token_type);
        var data = context_data;
    
        var config = {
            method: 'post',
            url: process.env.WF_URL, //'https://api.workflow-sap.cfapps.us10.hana.ondemand.com/workflow-service/rest/v1/workflow-instances',
            headers: {
                //'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vNDY5YjlhN2F0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktLTEyNjY4MjYzNDUiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiJkNTU1MzY0MTczNzE0MDZmODM1NGRmNTQzNmNhNmQwMCIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiJkMzFiNWQ3Ni0zODJkLTRiYjQtOWUwYi01ZmIxNmU0NDY3MjciLCJ6ZG4iOiI0NjliOWE3YXRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiJiOWEzOGRkZi02NWJlLTRlZjctODY0OS1iNzQ4MjUxMDZkN2MifSwic3ViIjoic2ItY2xvbmUtYjlhMzhkZGYtNjViZS00ZWY3LTg2NDktYjc0ODI1MTA2ZDdjIWI5Njg5NHx3b3JrZmxvdyFiMTc3NCIsImF1dGhvcml0aWVzIjpbIndvcmtmbG93IWIxNzc0LlBST0NFU1NfVkFSSUFOVF9ERVBMT1kiLCJ1YWEucmVzb3VyY2UiLCJ3b3JrZmxvdyFiMTc3NC5NRVNTQUdFX1NFTkQiLCJ3b3JrZmxvdyFiMTc3NC5UQVNLX0NPTVBMRVRFIiwid29ya2Zsb3chYjE3NzQuV09SS0ZMT1dfREVGSU5JVElPTl9HRVQiLCJ3b3JrZmxvdyFiMTc3NC5XT1JLRkxPV19ERUZJTklUSU9OX0RFUExPWSIsIndvcmtmbG93IWIxNzc0LldPUktGTE9XX0lOU1RBTkNFX0dFVCIsIndvcmtmbG93IWIxNzc0LlBST0NFU1NfVEVNUExBVEVfREVQTE9ZIiwid29ya2Zsb3chYjE3NzQuV09SS0ZMT1dfSU5TVEFOQ0VfU1RBUlQiLCJ3b3JrZmxvdyFiMTc3NC5UQVNLX0dFVCIsIndvcmtmbG93IWIxNzc0LkpPQl9TVEFUVVNfR0VUIiwid29ya2Zsb3chYjE3NzQuVEFTS19VUERBVEUiLCJ3b3JrZmxvdyFiMTc3NC5UQVNLX0RFRklOSVRJT05fR0VUIiwid29ya2Zsb3chYjE3NzQuV09SS0ZMT1dfSU5TVEFOQ0VfR0VUX0NPTlRFWFQiLCJ3b3JrZmxvdyFiMTc3NC5GT1JNX0RFRklOSVRJT05fREVQTE9ZIiwid29ya2Zsb3chYjE3NzQuV09SS0ZMT1dfSU5TVEFOQ0VfVVBEQVRFX0NPTlRFWFQiXSwic2NvcGUiOlsid29ya2Zsb3chYjE3NzQuUFJPQ0VTU19WQVJJQU5UX0RFUExPWSIsInVhYS5yZXNvdXJjZSIsIndvcmtmbG93IWIxNzc0Lk1FU1NBR0VfU0VORCIsIndvcmtmbG93IWIxNzc0LlRBU0tfQ09NUExFVEUiLCJ3b3JrZmxvdyFiMTc3NC5XT1JLRkxPV19ERUZJTklUSU9OX0dFVCIsIndvcmtmbG93IWIxNzc0LldPUktGTE9XX0RFRklOSVRJT05fREVQTE9ZIiwid29ya2Zsb3chYjE3NzQuV09SS0ZMT1dfSU5TVEFOQ0VfR0VUIiwid29ya2Zsb3chYjE3NzQuUFJPQ0VTU19URU1QTEFURV9ERVBMT1kiLCJ3b3JrZmxvdyFiMTc3NC5XT1JLRkxPV19JTlNUQU5DRV9TVEFSVCIsIndvcmtmbG93IWIxNzc0LlRBU0tfR0VUIiwid29ya2Zsb3chYjE3NzQuSk9CX1NUQVRVU19HRVQiLCJ3b3JrZmxvdyFiMTc3NC5UQVNLX1VQREFURSIsIndvcmtmbG93IWIxNzc0LlRBU0tfREVGSU5JVElPTl9HRVQiLCJ3b3JrZmxvdyFiMTc3NC5XT1JLRkxPV19JTlNUQU5DRV9HRVRfQ09OVEVYVCIsIndvcmtmbG93IWIxNzc0LkZPUk1fREVGSU5JVElPTl9ERVBMT1kiLCJ3b3JrZmxvdyFiMTc3NC5XT1JLRkxPV19JTlNUQU5DRV9VUERBVEVfQ09OVEVYVCJdLCJjbGllbnRfaWQiOiJzYi1jbG9uZS1iOWEzOGRkZi02NWJlLTRlZjctODY0OS1iNzQ4MjUxMDZkN2MhYjk2ODk0fHdvcmtmbG93IWIxNzc0IiwiY2lkIjoic2ItY2xvbmUtYjlhMzhkZGYtNjViZS00ZWY3LTg2NDktYjc0ODI1MTA2ZDdjIWI5Njg5NHx3b3JrZmxvdyFiMTc3NCIsImF6cCI6InNiLWNsb25lLWI5YTM4ZGRmLTY1YmUtNGVmNy04NjQ5LWI3NDgyNTEwNmQ3YyFiOTY4OTR8d29ya2Zsb3chYjE3NzQiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjU1YzEyOGZiIiwiaWF0IjoxNjYwMjg2NjUxLCJleHAiOjE2NjAzMjk4NTEsImlzcyI6Imh0dHBzOi8vNDY5YjlhN2F0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiZDMxYjVkNzYtMzgyZC00YmI0LTllMGItNWZiMTZlNDQ2NzI3IiwiYXVkIjpbIndvcmtmbG93IWIxNzc0IiwidWFhIiwic2ItY2xvbmUtYjlhMzhkZGYtNjViZS00ZWY3LTg2NDktYjc0ODI1MTA2ZDdjIWI5Njg5NHx3b3JrZmxvdyFiMTc3NCJdfQ.N3XciV4kl55A_yRcy6qjftS4su33NEsfjM07bwsdKogycZdsDHFP_ghw-ISWsYpE_NhQuPgdussGWvUCsnmUL0b6AFYjsjErGHxAaA4loP5Fz4mCKx0P1gdD9X5yPB0xV1K_bS9PpLxfQIoAteqa0IsCPzI0xUuBmjCg0PpudeCGeDDmLBIFQpYJbwDi9YAqFq5mKU_hHIp_nPdOIFgXyn0mYpNS-FWXWlK0nKo-L3N9mdugDddMSyZqBwm7Tefaj4r07aDWH5nhPuCTDdcuQ46idFhbKvERmU28f3OkTOKN7esRU9fnkoHL8kt6LIN8XkM2bW_Er_ggEDRabmWxdQ',
                'Authorization': res.data.token_type + ' ' + res.data.access_token,
                'Content-Type': 'application/json'
            },
            data: data
        };
    
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    
    }).catch(function (err) {
        console.log("error = " + err);
    });
    
}

module.exports.trigger_wf = trigger_wf;
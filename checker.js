var request = require('request');

function check(url, invocationParameters, expectedResultData, expectedResultStatus) {

    console.log(url);

    return new Promise(resolve => { 

        const checkResult = { // this is the object you need to set and return
            urlChecked: url,
            resultData: null,
            resultStatus: null,
            statusTestPassed: null,
            resultDataAsExpected: null
        }

        httpRequest(url, invocationParameters)
            .then(out => {

                checkResult.resultData = out.response;
                checkResult.resultStatus = out.status;
                checkResult.statusTestPassed = out.status == expectedResultStatus;
                checkResult.resultDataAsExpected = compareResults(expectedResultData, out.response);

                resolve(checkResult);

            });
        });
}

function httpRequest(URL, data) { 
    console.log('\n');
    console.log('Requested to', URL);

    return new Promise(resolve => {        
        request({url:URL, qs:data}, function(err, response, body) {
            if(err) { 
                console.log(err); resolve();
            }
            
            var out = {};
            try {
                out.status = response.statusCode;
                out.response = JSON.parse(response.body);
            }
            catch(e) {
                out.error = {error: "Errore nel parsing JSON", errorObj: e}
            }
            
            console.log('Response JSON', out);
            resolve(out);
        });
    });
}


// funzione che confronta due oggetti semplici e verifica se actual contiene tutti gli attributi di expected, e se per
// questi ha gli stessi valori
function compareResults(expected, actual) {
    if (!expected) return true //always ok if there are no expectations
    if (!actual) return false
    for (let e of Object.keys(expected)) {
        if (actual[e]===undefined || expected[e]!=actual[e]  ) return false
    }
    return true
}

module.exports.check = check
const fs = require('fs');
const CloudmersiveVirusApiClient = require('cloudmersive-virus-api-client');

var defaultClient = CloudmersiveVirusApiClient.ApiClient.instance;
 
// Configure API key authorization: Apikey
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = "f3ad1f2d-4b11-4e8b-bc5a-f9ab3202247c";
 
var api = new CloudmersiveVirusApiClient.ScanApi()
 
var inputFile = fs.readFileSync("C:\\Users\\User\\Downloads\\c9266ddd9fde30cdf231365c72ddc106c88fa6adedaff72424ca28037927aae7.exe");
console.log(inputFile);
 
 
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
    console.log(data);
  }
};

api.scanFile(Buffer.from(inputFile.buffer), callback);
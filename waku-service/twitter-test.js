var Twit = require('twit')
var credentials = require('../../credentials.json');
var T = new Twit(credentials);
//var T = new Twit({
//  consumer_key:         'XYBOqj4WHHHLTN03H8xI7yteJ',
  // don't save this on github!
//  consumer_secret:      '...',
//  access_token:         '725436727637213184-YkMfLMlOuyhEbMoJZ9XMa6reaG1P1kU',
  // don't save this on github!
//  access_token_secret:  '...',
//  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//});

//T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//  console.log(data)
//});

T.post('direct_messages/new', { screen_name: 'aqulu1', text: 'hallo test 1234' }, function(err, data, response) {
  console.log(data)
});


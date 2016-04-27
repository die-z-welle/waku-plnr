var Twit = require('twit')

var T = new Twit({
  consumer_key:         'XYBOqj4WHHHLTN03H8xI7yteJ',
  // don't save the secrets anywhere on github!
  consumer_secret:      '...',
  access_token:         '725436727637213184-YkMfLMlOuyhEbMoJZ9XMa6reaG1P1kU',
  // don't save the secrets anywhere on github!
  access_token_secret:  '...',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
  console.log(data)
});

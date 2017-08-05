const Crypto = require('wcrypto');

$( () => {

  // Helper methods
  function requestServer(url) {
    const promise = $.ajax(url).done( (response) => {
      console.log(`${url}: ${ JSON.stringify(response) }`);
      return Promise.resolve(response);
    }).fail( (error) => {
      console.error(`${url}: ${ JSON.stringify(error) }`);
      return Promise.reject(error);
    });
    return promise;
  };

  // Button actions handlers
  $('#find-beneficiary').click( (e) => {
    // request a public key if exists
    requestServer('http://localhost:1337/key/public').then( (response) => {
      //todo: check if exists and warn a user if does not
      $('#beneficiary-public-key').text(response.publicKey);
      $('#beneficiary-public-key-error').text('');
    }).catch( (error) => {
      $('#beneficiary-public-key').text('');
      $('#beneficiary-public-key-error').text(error.statusText);
    });
  });

  $('#request-key').click( (e) => {
    // pass the user's address to the server and get server's public key
    requestServer('http://localhost:1337/key/encryption').then( (response) => {
      $('#platform-public-key').text(response.publicKey);
      $('#platform-public-key-error').text('');
    }).catch( (error) => {
      $('#platform-public-key').text('');
      $('#platform-public-key-error').text(error.statusText);
    });
  });

  $('#create-will').click( (e) => {
    // encrypt the will & generate a transactoin
  });

  $('#publish-will').click( (e) => {
    // send the trasaction to the network
  });

  // Initialize the page
  function configure(query) {
    // parse the params & store the PlatformID
    const params = {};
    const queries = query.split('&');
    for (let i = 0; i < queries.length; i++) {
      const split = queries[i].split('=');
      if (split.length != 2) continue;
      params[split[0]] = split[1];
    }
    console.log(params);
  };

  configure(window.location.search.slice(1));
});

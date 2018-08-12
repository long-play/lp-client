class EWillBase {
  // Public functions
  constructor(gethUrl) {
    if (gethUrl && typeof gethUrl === 'string' && gethUrl.length > 0) {
      this._web3 = new Web3(gethUrl);
    }
  }

  isLoggedIn() {
    //todo: for debug purposes only
    return true;

    let result = false;
    if (this.userPrivateKey) {
      result = true;
    }
    return result;
  }

  ajaxRequest(url, options) {
    const promise = $.ajax(url, options).done( (response) => {
      console.log(`${url}: ${ JSON.stringify(response) }`);
      return Promise.resolve(response);
    }).fail( (error) => {
      console.error(`${url}: ${ JSON.stringify(error) }`);
      return Promise.reject(error);
    });
    return promise;
  }

  jsonRequest(url, options) {
    return this.ajaxRequest(url, Object.assign({ dataType: 'json' }, options));
  }

  // Accessors
  set userPrivateKey(privKey) {
    if (typeof Storage && sessionStorage.userPrivateKey != privKey) {
      sessionStorage.userPrivateKey = privKey;
    }
    this._privateKey = privKey;
  }

  get userPrivateKey() {
    if (!this._privateKey && typeof Storage && sessionStorage.userPrivateKey) {
      this._privateKey = sessionStorage.userPrivateKey;
    }
    return this._privateKey;
  }

  // Protected functions
  _configureContracts(contracts) {
    const promises = [];
    for (let contractName in contracts) {
      const promise = this.jsonRequest(contracts[contractName].abi).then( (abi) => {
        this[contractName] = new this.web3.eth.Contract(abi, contracts[contractName].address);
        return this[contractName].methods.name().call();
      }).then( (name) => {
        console.log(`Initialized the contract '${name}'.`);
        return Promise.resolve(this[contractName]);
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  }
}

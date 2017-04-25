const request = require('request');
const Constants = require('../lib/util/constants.js');
const OverwatchRequest = require ('../lib/overwatch/requests.js');

describe ('Request test', () => {
  let collectionSpy, promise, promiseHelper, requestObj;

  beforeEach(() => {
    let fetchPromise = new Promise((resolve, reject) => {
      promiseHelper = {
        resolve: resolve,
        reject: reject
      };
    });
    collectionSpy = jasmine.createSpyObj('collection', ['get', 'set']);
    requestObj = new OverwatchRequest({}, collectionSpy, 'battletag#1342');

    promise = requestObj.getStats();
  });

  it ('returns a promise', () => {
    expect(promise).toEqual(jasmine.any(Promise));
  });

  describe ('on a successful request', () => {
    beforeEach(() => {
      const response = JSON.stringify({
        sr: 3200
      });

      promiseHelper.resolve(response);
    });

    it ('resolves with stats', () => {
      promise.then((response) => {
        expect(response.sr).toBe(3200);
        done();
      });
    });
  });

  describe ('on a failed request', () => {
    const errorObj = { msg: 'Something went wrong' };

    beforeEach(() => {
      promiseHelper.reject(errorObj);
    });

    it ('rejects promise with error', () => {
      promise.catch((error) => {
        expect(error).toEqual(errorObj);
      });
    });
  });
});
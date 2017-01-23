module.exports = Constants = {
  colors: {
    error: 15158332,
    success: 3066993,
    overwatch: {
      quickplay: 3447003,
      competitive: 10181046
    }
  },
  OVERWATCH_API: 'https://owapi.net/api/v3/u',

  endpoints: {
    overwatch: {
      general: (battletag) => { return `${Constants.OVERWATCH_API}/${battletag}/blob`; }
    }
  }
};
module.exports = Constants = {
  overwatch: {
    apiUrl: 'https://owapi.net/api/v3/u',
    battletagRegex: '^\\D.{2,11}#\\d{4}$',
    endpoints: {
      general: (battletag) => { return `${Constants.overwatch.apiUrl}/${battletag}/blob`; }
    },
    mode: {
      quickplay: 'quickplay',
      competitive: 'competitive'
    }
  },
  colors: {
    error: 15158332,
    success: 3066993,
    overwatch: {
      quickplay: 3447003,
      competitive: 10181046
    }
  }
};
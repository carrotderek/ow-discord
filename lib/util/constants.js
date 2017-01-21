module.exports = Constants = {
  colors: {
    error: 15158332,
    success: 3066993
  },
  OVERWATCH_API: 'https://owapi.net/api/v3/u',

  endpoints: {
    overwatch: {
      general: (battletag) => { return `${Constants.OVERWATCH_API}/${battletag}/stats` },
      hero: (battletag) => { return `${Constants.OVERWATCH_API}/${battletag}/heroes` }
    }
  }
};
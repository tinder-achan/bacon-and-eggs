const request = require('request');

const GH_API = 'https://api.github.com/repos/TinderApp/TinderWeb/pulls/' +
    process.env.CIRCLE_PR_NUMBER + '/comments';


import AWS from 'aws-sdk';

// TODO, Load config
const eb = new AWS.ElasticBeanstalk({
  region: 'us-east-1'
});
const BRANCH_NAME = process.env.CIRCLE_BRANCH || 'demo';

eb.createApplication({
  ApplicationName: BRANCH_NAME
}, (err, data) => {
  if (err) {
    console.log(err);
  }
});

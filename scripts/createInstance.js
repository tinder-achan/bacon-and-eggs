import AWS from 'aws-sdk';

// TODO, Load config
const eb = new AWS.ElasticBeanstalk({
  region: 'us-west-1'
});
const BRANCH_NAME = process.env.CIRCLE_BRANCH || 'demo';

eb.createEnvironment({
  ApplicationName: 'tester',
  EnvironmentName: BRANCH_NAME,
  TemplateName: 'sandboxes'
}, (err, data) => {
  if (err) {
    console.log(err);
  }
});

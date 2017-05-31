import AWS from 'aws-sdk';

// TODO, Load config
const eb = new AWS.ElasticBeanstalk({
  region: 'us-east-1'
});

eb.createApplication({
  ApplicationName: 'example'
}, (err, data) => {
  if (err) {
    console.log(err);
  }
});

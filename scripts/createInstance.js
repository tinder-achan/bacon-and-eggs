import AWS from 'aws-sdk';
import auto from 'async/auto';

// TODO, Load config
const eb = new AWS.ElasticBeanstalk({
  region: 'us-west-1'
});

const ENV_EXISTS_ERR_MSG = 'Environment sandbox already exists.';

const BRANCH_NAME = process.env.CIRCLE_BRANCH || 'demo';

auto({
  create: (cb) => {
    eb.createEnvironment({
      ApplicationName: 'tester',
      EnvironmentName: BRANCH_NAME,
      TemplateName: 'sandboxes'
    }, (err, data) => {
      if (err) {
        console.log(err);
        if (err.message === ENV_EXISTS_ERR_MSG) {
          console.log('Env already exists');

          
        }
      }
      console.log(data);
      cb(null, data);
    });
  }
}, (err, data) => {});

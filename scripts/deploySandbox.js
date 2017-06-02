const AWS = require("aws-sdk");
const async = require("async");

const eb = new AWS.ElasticBeanstalk({
  region: "us-west-1"
});

const route53 = new AWS.Route53();

const BRANCH_NAME = process.env.CIRCLE_BRANCH;
const ENV_EXISTS_ERR_MSG = "Environment " + BRANCH_NAME + " already exists.";
let envURL = '';
let isExistingEnv = false;

console.log(BRANCH_NAME);
console.log(process.env.ZIP_FILENAME);

async.auto({
    createEnv: function(cb) {
        eb.createEnvironment({
                ApplicationName: "tester",
                EnvironmentName: BRANCH_NAME,
                TemplateName: "sandboxes"
            },
            (err, data) => {
                if (err) {
                    if (err.message === ENV_EXISTS_ERR_MSG) {
                        console.log("Env already exists");
                        isExistingEnv = true;
                        return cb(null);
                    }

                    return cb(err);
                }
                console.log(data);
                cb(null, data);
            }
            );

    },

    createAppVersion: ['createEnv', function createAppVersion(results, cb) {
        const params = {
            ApplicationName: 'tester',
            VersionLabel: process.env.ZIP_FILENAME,
            SourceBundle: {
                S3Bucket: process.env.S3_BUCKET,
                S3Key: 'sandboxes/' + process.env.ZIP_FILENAME
            }
        }

        eb.createApplicationVersion(params, function(err, data) {
            if (err) return cb(err);
            console.log(JSON.stringify(data));
            return cb(null, data);
        });
    }],

    updateEnv: ['createAppVersion', function updateEnv(results, cb) {
        const params = {
            ApplicationName: 'tester',
            EnvironmentName: BRANCH_NAME,
            VersionLabel: process.env.ZIP_FILENAME
        };
        eb.updateEnvironment(params, function(err, data) {
            if (err) return cb(err);
            console.log(JSON.stringify(data));            
            envURL = data.CNAME;
            return cb(null, data);
        });
    }],

    createDNS: ['updateEnv', function createDNS(results, cb) {
        if (isExistingEnv) return cb();
        if (!envURL) return cb(new Error('No env url'));

        const params = {
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'CREATE',
                        ResourceRecordSet: {
                            Name: BRANCH_NAME + '.tindersandbox.com',
                            Type: 'A',
                            AliasTarget: {
                                HostedZoneId: 'Z1LQECGX5PH1X',
                                DNSName: envURL,
                                EvaluateTargetHealth: false
                            }
                        }
                    }
                ]
            }
        }

        route53.changeResourceRecordSets(params, function(err, data) {
            if (err) return cb(err);

            console.log(data);
            cb(null, data);
        });

    }]
}, function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    else {
        process.exit(0);
    }
})

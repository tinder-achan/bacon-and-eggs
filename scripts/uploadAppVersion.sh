S3_REGION=us-west-1
S3_BUCKET=elasticbeanstalk-us-west-1-648980024845/sandboxes
ZIP_FILENAME=$CIRCLE_BRANCH-$CIRCLE_SHA1-$CIRCLE_BUILD_NUM.zip
ENV_TEMPLATE=sandboxes

if [[ -z $S3_BUCKET ]]; then

  cat <<END
\$S3_BUCKET environment variable not set.
$(tput sgr 0)
END

  exit 1
fi

git archive --format=zip HEAD > $ZIP_FILENAME

aws configure set default.region $S3_REGION

aws s3 cp $ZIP_FILENAME s3://$S3_BUCKET/$ZIP_FILENAME

echo "Uploaded source to S3"

{
    aws elasticbeanstalk create-environment --application-name tester --environment-name $CIRCLE_BRANCH --template-name $ENV_TEMPLATE
    echo "Created environment"
} || {
    echo "env already exists"
}

aws elasticbeanstalk create-application-version --application-name tester --version-label $ZIP_FILENAME --source-bundle S3Bucket=$S3_BUCKET,S3Key=$ZIP_FILENAME
echo "Created application version"
aws elasticbeanstalk update-environment --application-name tester --environment-name $CIRCLE_BRANCH
echo "Updated environment"

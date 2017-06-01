S3_REGION=us-west-1
ZIP_FILENAME=$CIRCLE_BRANCH-$CIRCLE_SHA1-$CIRCLE_BUILD_NUM


if [[ -z $S3_BUCKET ]]; then

  cat <<END
\$S3_BUCKET environment variable not set.
$(tput sgr 0)
END

  exit 1
fi


git archive --format=zip HEAD > $ZIP_FILENAME
aws configure set default.region $S3_REGION

aws s3 cp $ZIP_FILENAME $ s3://$S3_BUCKET

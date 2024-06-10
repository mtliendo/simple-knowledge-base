#!/bin/bash

# Path to the amplify_outputs.json file
AMPLIFY_OUTPUTS_FILE="./amplify_outputs.json"

# Extract the bucket name from the configuration file
BUCKET_NAME=$(jq -r '.storage.bucket_name' $AMPLIFY_OUTPUTS_FILE)

# Path to the CSV file you want to upload
CSV_FILE="./setlist.csv"

# Upload the CSV file to the S3 bucket
aws s3 cp $CSV_FILE s3://$BUCKET_NAME/skillset/

echo "CSV file uploaded to S3 bucket $BUCKET_NAME"

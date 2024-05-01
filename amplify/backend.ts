import { storage } from './storage/resource'
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
	auth,
	data,
	storage,
})
const fileDirectoryName = 'skillset'
const fileName = 'setlist.csv'

backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
	bucketUri: `s3://${backend.storage.resources.bucket.bucketName}/${fileDirectoryName}/${fileName}`,
}

backend.addOutput({
	custom: { fileName },
})

const bedrockKBDatasource = backend.data.addHttpDataSource(
	'BedrockHTTPDS',
	'https://bedrock-agent-runtime.us-east-1.amazonaws.com',
	{
		authorizationConfig: {
			signingRegion: 'us-east-1',
			signingServiceName: 'bedrock',
		},
	}
)

bedrockKBDatasource.grantPrincipal.addToPrincipalPolicy(
	new PolicyStatement({
		resources: ['*'],
		actions: ['bedrock:RetrieveAndGenerate'],
	})
)

bedrockKBDatasource.grantPrincipal.addToPrincipalPolicy(
	new PolicyStatement({
		resources: [`${backend.storage.resources.bucket.bucketArn}/*`],
		actions: ['s3:getObject'],
	})
)

bedrockKBDatasource.grantPrincipal.addToPrincipalPolicy(
	new PolicyStatement({
		resources: [
			'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0',
		],
		actions: ['bedrock:InvokeModel'],
	})
)

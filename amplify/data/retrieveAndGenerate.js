export function request(ctx) {
	return {
		resourcePath: '/retrieveAndGenerate',
		method: 'POST',
		params: {
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				input: {
					text: ctx.args.text,
				},
				retrieveAndGenerateConfiguration: {
					externalSourcesConfiguration: {
						modelArn:
							'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0',
						sources: [
							{
								s3Location: {
									uri: `s3://${ctx.args.bucketName}/skillset/${ctx.args.fileName}`,
								},
								sourceType: 'S3',
							},
						],
					},
					type: 'EXTERNAL_SOURCES',
				},
			},
		},
	}
}
export function response(ctx) {
	console.log(JSON.parse(ctx.result.body))
	return JSON.parse(ctx.result.body).citations[0].generatedResponsePart
		.textResponsePart.text
}

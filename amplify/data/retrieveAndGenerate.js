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
									uri: ctx.env.bucketUri,
								},
								sourceType: 'S3',
							},
						],
					},
					type: 'EXTERNAL_SOURCES',
				},
				sessionId: ctx.args.sessionId ?? null,
			},
		},
	}
}
export function response(ctx) {
	const parsedBody = JSON.parse(ctx.result.body)
	const res = {
		text: parsedBody.citations[0].generatedResponsePart.textResponsePart.text,
		sessionId: parsedBody.sessionId,
	}
	console.log(res)
	return res
}

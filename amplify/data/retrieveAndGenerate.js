export function request(ctx) {
  console.log('request ctx', ctx)
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
            modelArn: ctx.env.bedrockArn,
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
  console.log('repsonse ctx', ctx)
  const parsedBody = JSON.parse(ctx.result.body)
  const res = {
    text: parsedBody.citations[0].generatedResponsePart.textResponsePart.text,
    sessionId: parsedBody.sessionId,
  }
  console.log(res)
  return res
}

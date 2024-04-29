import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
	noop: a
		.query()
		.returns(a.string())
		.authorization((allow) => [allow.guest()])
		.handler(
			a.handler.custom({
				dataSource: 'BedrockHTTPDS',
				entry: './retrieveAndGenerate.js',
			})
		),
	generateTextFromPrompt: a
		.mutation()
		.arguments({
			text: a.string(),
			bucketName: a.string(),
			fileName: a.string(),
		})
		.returns(a.string())
		.authorization((allow) => [allow.guest(), allow.authenticated()])
		.handler(
			a.handler.custom({
				dataSource: 'BedrockHTTPDS',
				entry: './retrieveAndGenerate.js',
			})
		),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'iam',
	},
})

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
			text: a.string().required(),
			sessionId: a.string(),
		})
		.returns(a.ref('BedrockResponse'))
		.authorization((allow) => [allow.publicApiKey(), allow.authenticated()])
		.handler(
			a.handler.custom({
				dataSource: 'BedrockHTTPDS',
				entry: './retrieveAndGenerate.js',
			})
		),
	BedrockResponse: a.customType({
		text: a
			.string()
			.required()
			.authorization((allow) => [allow.publicApiKey(), allow.authenticated()]),
		sessionId: a
			.string()
			.required()
			.authorization((allow) => [allow.publicApiKey(), allow.authenticated()]),
	}),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'userPool',
		apiKeyAuthorizationMode: {
			expiresInDays: 14,
		},
	},
})

'use client'
import amplifyconfig from '../amplifyconfiguration.json'
import { Amplify } from 'aws-amplify'

Amplify.configure(amplifyconfig, {
	Storage: {
		S3: {
			prefixResolver: ({ accessLevel }) => {
				if (accessLevel === 'guest') {
					return 'skillset/'
				}
			},
		},
	},
})

import { ChatPage } from '@/components/chat-page'
import { withAuthenticator } from '@aws-amplify/ui-react'

const bucketName = Amplify.getConfig().Storage?.S3.bucket!

function Home({ signOut }) {
	return <ChatPage signOut={signOut} bucketName={bucketName} />
}

export default Home

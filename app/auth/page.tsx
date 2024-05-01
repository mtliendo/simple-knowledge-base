'use client'
import React from 'react'
import amplifyconfig from '@/amplify_outputs.json'
import { StorageManager } from '@aws-amplify/ui-react-storage'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import Link from 'next/link'

Amplify.configure(amplifyconfig)
const fileName = amplifyconfig.custom.fileName

function AuthPage({ signOut }) {
	return (
		<div>
			<header className="bg-gray-900 text-white py-4 px-6 items-center">
				<div className="flex justify-between">
					<h2 className="text-lg font-medium">
						<Link href="/">Focus Otter</Link>
					</h2>
					<button onClick={signOut} className="btn">
						sign out
					</button>
				</div>
			</header>
			<p className="mt-12 mb-6">The file needs to be called: {fileName}</p>
			<StorageManager
				acceptedFileTypes={['.csv']}
				path="skillset/"
				maxFileCount={1}
			/>
		</div>
	)
}

export default withAuthenticator(AuthPage)

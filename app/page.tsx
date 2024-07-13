'use client'

import type { Schema } from '@/amplify/data/resource'
import { Amplify } from 'aws-amplify'
import { FormEvent, useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import { v4 } from 'uuid'
import { clsx } from 'clsx'
import amplifyconfig from '@/amplify_outputs.json'
import Link from 'next/link'
import { Loader, withAuthenticator } from '@aws-amplify/ui-react'

Amplify.configure(amplifyconfig)

type msgObj = { id: string; author: 'me' | 'Bot'; text: string }

function ChatPage() {
	const client = generateClient<Schema>()
	const [msgText, setMsgText] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [msgs, setMsgs] = useState<Array<msgObj>>([
		{
			id: '1',
			author: 'Bot',
			text: 'Hey! I know a lot of stuff about services going on in your neighborhood! You can even ask followup questions as well!',
		},
	])
	const [sessionId, setSessionId] = useState<null | string>(null)

	const handleFormSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setMsgText('')
		setIsLoading(true)
		// Store the initial state change
		const userMessage: msgObj = {
			id: v4(),
			author: 'me',
			text: msgText,
		}

		setMsgs([...msgs, userMessage])

		try {
			const { data, errors } = await client.mutations.generateTextFromPrompt(
				{
					text: msgText,
					sessionId,
				},
				{
					authMode: 'userPool',
				}
			)

			if (data) {
				setSessionId(data?.sessionId!)

				// Combine the initial state change with the updated state
				setMsgs((prevMsgs) => [
					...prevMsgs,
					{
						id: v4(),
						author: 'Bot',
						text: data?.text!,
					} as msgObj,
				])
				setIsLoading(false)
			}
			if (errors) {
				console.error('Error generating text from prompt:', errors)
				setMsgs((prevMsgs) => [
					...prevMsgs,
					{
						id: v4(),
						author: 'Bot',
						text: 'Something went wrong',
					} as msgObj,
				])
				setSessionId(null)
				setIsLoading(false)
				return
			}
		} catch (error) {
			console.error('Error generating text from prompt:', error)
			setIsLoading(false)
		}
	}
	return (
		<div className="flex flex-col h-screen">
			<header className="bg-gray-900 text-white py-4 px-6">
				<div className="flex justify-between">
					<h2 className="text-lg font-medium">Focus Otter</h2>
					<Link href="/auth">manage data</Link>
				</div>
			</header>
			<div className="flex-1 overflow-y-auto p-6 space-y-4">
				{msgs.map((msg) => (
					<div
						key={msg.id}
						className={clsx(
							`flex ${msg.author === 'me' ? 'justify-end' : 'justify-start'}`
						)}
					>
						<div
							className={clsx(
								'px-4 py-2 rounded-lg',
								msg.author === 'Bot'
									? `bg-gray-200 text-gray-800   max-w-[40%]`
									: 'bg-blue-500 text-white  max-w-[70%]'
							)}
						>
							<p className="whitespace-pre-wrap">{msg.text}</p>
						</div>
					</div>
				))}
				<div className={clsx('justify-start', isLoading ? 'block' : 'hidden')}>
					<Loader style={{ stroke: '#3B82FC' }} size="large" />
				</div>
			</div>
			<form
				onSubmit={handleFormSubmit}
				className="bg-gray-100 py-4 px-6 flex items-center"
			>
				<input
					className="flex-1 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Type your message..."
					type="text"
					value={msgText}
					onChange={(e) => setMsgText(e.target.value)}
				/>
				<button
					type="submit"
					className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
				>
					Send
				</button>
			</form>
		</div>
	)
}

export default withAuthenticator(ChatPage)

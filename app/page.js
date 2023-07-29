'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

let socket

export default function Home() {
	const [showSetup, setShowSetup] = useState(true)
	const [message, setMessage] = useState('')
	const [username, setUsername] = useState('')
	const [allMessages, setAllMessages] = useState([])
	const [allUsers, setAllUsers] = useState([])

	useEffect(() => {
		socketInitializer()

		return () => {
			socket.disconnect()
		}
	}, [])

	async function socketInitializer() {
		await fetch('/api/socket')

		socket = io(undefined, {
			path: '/api/socket_io',
		})

		socket.on('receive-message', (data) => {
			setAllMessages((pre) => [...pre, data])
		})

		socket.on('retrieve-users', (data) => {
			setAllUsers((pre) => [...pre, data])
		})
	}

	function handleSetup(e) {
		e.preventDefault()

		console.log('setting user')

		setShowSetup(false)
	}

	function handleSubmit(e) {
		e.preventDefault()

		console.log('emitted')

		socket.emit('send-message', {
			username,
			message,
		})

		setMessage('')
	}

	return (
		<main className="min-h-screen">
			{showSetup ? (
				<div className="fixed flex items-center bg-black/80 h-screen w-full">
					<form
						onSubmit={handleSetup}
						className="flex flex-col gap-4 bg-white rounded-lg mx-auto p-12 text-center w-1/2"
					>
						<h2 className="text-black font-bold text-2xl uppercase">
							Chatroom
						</h2>
						<input
							className="p-4 border border-black text-black"
							type="text"
							placeholder="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<div className="text-black flex flex-col gap-2">
							<p className="font-bold">Choose a color: </p>
							<div className="flex flex-row justify-center gap-2 p-2">
								<button className="bg-black p-4"></button>
								<button className="bg-red-500 p-4"></button>
								<button className="bg-blue-500 p-4"></button>
								<button className="bg-green-500 p-4"></button>
								<button className="bg-yellow-500 p-4"></button>
								<button className="bg-orange-500 p-4"></button>
								<button className="bg-purple-500 p-4"></button>
								<button className="bg-cyan-500 p-4"></button>
							</div>
						</div>
						<button className="flex justify-center p-4 bg-yellow-500">
							Join
						</button>
					</form>
				</div>
			) : null}
			<div className="grid grid-cols-12 bg-black h-screen">
				<div className="col-span-4 bg-slate-600 p-6">
					<svg
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						width="21"
						height="21"
					>
						<path
							clip-rule="evenodd"
							d="M10.5 3.498a2.999 2.999 0 01-3 2.998 2.999 2.999 0 113-2.998zm2 10.992h-10v-1.996a3 3 0 013-3h4a3 3 0 013 3v1.997z"
							stroke="currentColor"
							stroke-linecap="square"
						></path>
					</svg>
					{allUsers.map(({ username }, index) => (
						<div key={index}>
							<p>{username}</p>
						</div>
					))}
				</div>
				<div className="col-span-8 flex flex-col items">
					<div className="bg-slate-900 w-full h-full p-6">
						<svg
							className="mb-2"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							width="21"
							height="21"
						>
							<path
								d="M11.5 13.5l.157-.475-.218-.072-.197.119.258.428zm2-2l-.421-.27-.129.202.076.226.474-.158zm1 2.99l-.157.476a.5.5 0 00.631-.634l-.474.159zm-3.258-1.418c-.956.575-2.485.919-3.742.919v1c1.385 0 3.106-.37 4.258-1.063l-.516-.856zM7.5 13.99c-3.59 0-6.5-2.909-6.5-6.496H0a7.498 7.498 0 007.5 7.496v-1zM1 7.495A6.498 6.498 0 017.5 1V0A7.498 7.498 0 000 7.495h1zM7.5 1C11.09 1 14 3.908 14 7.495h1A7.498 7.498 0 007.5 0v1zM14 7.495c0 1.331-.296 2.758-.921 3.735l.842.54C14.686 10.575 15 8.937 15 7.495h-1zm-2.657 6.48l3 .99.314-.949-3-.99-.314.949zm3.631.357l-1-2.99-.948.316 1 2.991.948-.317z"
								fill="currentColor"
							></path>
						</svg>
						{allMessages.map(({ username, message }, index) => (
							<div key={index}>
								<p className="text-lg pt-2">
									<span className="text-red-700">{username}</span>: {message}
								</p>
							</div>
						))}
					</div>
					<form
						onSubmit={handleSubmit}
						className="flex bg-gray-600 w-full h-64"
					>
						<textarea
							name="message"
							className="w-full h-full p-6 text-black"
							type="text"
							placeholder="enter message.."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<button
							type="submit"
							className="bg-gray-600 text-center items-center flex p-6 font-bold uppercase"
						>
							<svg
								viewBox="0 0 15 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								width="21"
								height="21"
							>
								<path
									d="M14.5.5l.46.197a.5.5 0 00-.657-.657L14.5.5zm-14 6l-.197-.46a.5.5 0 00-.06.889L.5 6.5zm8 8l-.429.257a.5.5 0 00.889-.06L8.5 14.5zM14.303.04l-14 6 .394.92 14-6-.394-.92zM.243 6.93l5 3 .514-.858-5-3-.514.858zM5.07 9.757l3 5 .858-.514-3-5-.858.514zm3.889 4.94l6-14-.92-.394-6 14 .92.394zM14.146.147l-9 9 .708.707 9-9-.708-.708z"
									fill="currentColor"
								></path>
							</svg>
						</button>
					</form>
				</div>
			</div>
		</main>
	)
}

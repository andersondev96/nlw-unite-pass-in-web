import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { FormEvent, useState } from 'react'

export function Button() {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")

	const [isOpen, setIsOpen] = useState(false)

	function handleSubmit(event: FormEvent) {
		event.preventDefault()

		const formData = {
			name,
			email
		}

		const url = new URL('http://localhost:3333/events/cb0e032a-fd91-440c-8093-34ae7b8566e7/attendees')

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
		.then(response => {
			if (!response.ok) {
				console.log(response)
			}
		})
		.then(() => {
			setIsOpen(false)
			location.reload()
		})
	}
	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger asChild>
			<button className="flex items-center py-2 px-5 justify-center bg-orange-400 rounded-lg hover:bg-orange-400/90">
			<span className="flex text-xs text-gray-900 font-semibold uppercase">Realizar inscrição</span>
		</button>
			</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0" />
			<Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
				<Dialog.Title className="text-gray-950 font-semibold mb-4 text-lg">Realizar cadastro</Dialog.Title>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-4">
						<div className="flex items-center gap-5">
							<label htmlFor="name" className="text-gray-800 text-right">Nome</label>
							<input
								className="text-gray-600 inline-flex w-full flex-1 items-center justify-center rounded px-2 leading-none outline-none"
								type="text" 
								placeholder='Digite o seu nome' 
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div className="flex items-center gap-5">
							<label htmlFor="email" className="text-gray-800 text-right">E-mail</label>
							<input 
								className="text-gray-600 inline-flex w-full flex-1 items-center justify-center rounded px-2 leading-none outline-none"
								type="email" 
								placeholder='Digite o seu e-mail'
								value={email}
								onChange={(e) => setEmail(e.target.value)} 
							/>
						</div>
					</div>

					<div className="mt-6 flex justify-end">
							<button type="submit" className="inline-flex items-center justify-center rounded p-2 bg-orange-400 text-gray-800 font-semibold uppercase text-sm hover:bg-orange-400/90">
								Salvar
							</button>
					</div>
				</form>
				<Dialog.Close asChild>
					<button 
						className="absolute top-3 right-3 inline-flex h-7 w-7 appearance-none items-center justify-center rounded-full focus:outline-none"
						aria-lang="close"
						>
							<X className="text-gray-400"/>
					</button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
		</Dialog.Root>
		
	)
}
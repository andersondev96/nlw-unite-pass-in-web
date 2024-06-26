import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { Dropdown } from './dropdown'
import { IconButton } from './icon-button'
import { RegisterAttendee } from './register-Attendee'
import { SortTableHeader } from './table/sort-table-header'
import { Table } from './table/table'
import { TableCell } from './table/table-cell'
import { TableHeader } from './table/table-header'
import { TableRow } from './table/table-row'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export interface Attendee {
	id: string
	name: string
	email: string
	createdAt: string
	checkedInAt: string | null
}

export function AttendeeList() {

	const [search, setSearch] = useState(() => {
		const url = new URL(window.location.toString())

		if (url.searchParams.has('search')) {
			return url.searchParams.get('search') ?? ''
		}

		return ''
	})

	const [page, setPage] = useState(() => {
		const url = new URL(window.location.toString())

		if (url.searchParams.has('page')) {
			return Number(url.searchParams.get('page'))
		}

		return 1
	})

	const [orderByColumn, setOrderByColumn] = useState(() => {
		const url = new URL(window.location.toString())

		if (url.searchParams.has('orderByColumn')) {
			return url.searchParams.get('orderByColumn') ?? 'createdAt'
		}

		return 'createdAt'
	});

	const [orderByDirection, setOrderByDirection] = useState(() => {
		const url = new URL(window.location.toString())

		if (url.searchParams.has('orderByDirection')) {
			return url.searchParams.get('orderByDirection') ?? 'asc'
		}

		return 'asc'
	});

	const [total, setTotal] = useState(0)
	const [attendees, setAttendees] = useState<Attendee[]>([])

	const totalPages = Math.ceil(total / 10)

	async function fetchAttendees() {
		const url = new URL('http://localhost:3333/events/cb0e032a-fd91-440c-8093-34ae7b8566e7/attendees')

		url.searchParams.set('pageIndex', String(page - 1))

		if (search.length > 0) {
			url.searchParams.set('query', search)
		}

		url.searchParams.set('orderByColumn', orderByColumn)
		url.searchParams.set('orderByDirection', orderByDirection)

		const response = await fetch(url)
		const data = await response.json()

		return data;
	}

	useEffect(() => {
		fetchAttendees()
			.then(data => {
				setAttendees(data.attendees)
				setTotal(data.total)
			})
	}, [page, search, orderByColumn, orderByDirection])

	function updateAttendeesList() {
		fetchAttendees()
			.then(data => {
				setAttendees(data.attendees)
				setTotal(data.total)
			})
	}

	function setCurrentSearch(search: string) {
		const url = new URL(window.location.toString())

		url.searchParams.set('search', search)

		window.history.pushState({}, "", url)

		setSearch(search)
	}

	function setCurrentPage(page: number) {
		const url = new URL(window.location.toString())

		url.searchParams.set('page', String(page))

		window.history.pushState({}, "", url)

		setPage(page)
	}

	function handleOrderByColumn(column: string) {
		const url = new URL(window.location.toString())

		const newDirection = column === orderByColumn ? (orderByDirection === 'asc' ? 'desc' : 'asc') : 'asc'

		url.searchParams.set('orderByColumn', column)
		url.searchParams.set('orderByDirection', newDirection)

		window.history.pushState({}, "", url)

		setOrderByColumn(column)
		setOrderByDirection(newDirection)
	}


	function onSearchInputOnChanged(event: ChangeEvent<HTMLInputElement>) {
		setCurrentSearch(event.target.value)
		setCurrentPage(1)
	}

	function goToFirstPage() {
		setCurrentPage(1)
	}

	function goToLastPage() {
		setCurrentPage(totalPages)
	}

	function goToPreviousPage() {
		setCurrentPage(page - 1)
	}

	function goToNextPage() {
		setCurrentPage(page + 1)


	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-3 items-center">
				<h1 className="text-2xl font-bold">Participantes</h1>
				<div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
					<Search className="size-4 text-emerald-300" />
					<input
						onChange={onSearchInputOnChanged}
						value={search}
						className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
						placeholder="Buscar participantes..."
					/>
				</div>
				<RegisterAttendee onRegister={updateAttendeesList} />
			</div>

			<Table>
				<thead>
					<tr className="border-b border-white/10">
						<TableHeader style={{ width: 48 }}>
							<input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
						</TableHeader>
							<SortTableHeader
								title="Código"
								column="id" 
								orderByColumn={orderByColumn}
								orderByDirection={orderByDirection}
								onOrderByColumn={handleOrderByColumn}
							/>
						<SortTableHeader
								title="Participantes"
								column="name" 
								orderByColumn={orderByColumn}
								orderByDirection={orderByDirection}
								onOrderByColumn={handleOrderByColumn}
							/>
							<SortTableHeader
								title="Data de inscrição"
								column="createdAt" 
								orderByColumn={orderByColumn}
								orderByDirection={orderByDirection}
								onOrderByColumn={handleOrderByColumn}
							/>
						<TableHeader>
							Data do check-in
						</TableHeader>
						<TableHeader style={{ width: 64 }}></TableHeader>
					</tr>
				</thead>
				<tbody>
					{attendees.map((attendee) => {
						return (
							<TableRow key={attendee.id} className="border-b border-white/10 hover:bg-white/5">
								<TableCell>
									<input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
								</TableCell>
								<TableCell>{attendee.id}</TableCell>
								<TableCell>
									<div className="flex flex-col gap-1">
										<span className="font-semibold text-white">{attendee.name}</span>
										<span>{attendee.email}</span>
									</div>
								</TableCell>
								<TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
								<TableCell>
									{attendee.checkedInAt === null
										? <span className='text-zinc-400'>Não fez check-in</span>
										: dayjs().to(attendee.checkedInAt)
									}
								</TableCell>
								<TableCell>
									<Dropdown attendee={attendee} onUpdateList={updateAttendeesList} />
								</TableCell>
							</TableRow>
						)
					})}
				</tbody>
				<tfoot>
					<tr>
						<TableCell colSpan={3}>
							Mostrando {attendees.length} de {total} itens
						</TableCell>
						<TableCell className="text-right" colSpan={3}>
							<div className="inline-flex items-center gap-8">
								<span>Página {page} de {totalPages}</span>

								<div className="flex gap-1.5">
									<IconButton onClick={goToFirstPage} disabled={page === 1}>
										<ChevronsLeft className="size-4" />
									</IconButton>
									<IconButton onClick={goToPreviousPage} disabled={page === 1}>
										<ChevronLeft className="size-4" />
									</IconButton>
									<IconButton onClick={goToNextPage} disabled={page === totalPages}>
										<ChevronRight className="size-4" />
									</IconButton>
									<IconButton onClick={goToLastPage} disabled={page === totalPages}>
										<ChevronsRight className="size-4" />
									</IconButton>
								</div>
							</div>
						</TableCell>
					</tr>
				</tfoot>
			</Table>
		</div>
	)
}
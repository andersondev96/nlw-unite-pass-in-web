import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react";
import { TableHeader } from "./table-header";

interface SortTableHeaderProps {
	title: string
	column: string
	orderByColumn: string;
	orderByDirection: string;
	onOrderByColumn: (column: string) => void;
}

export function SortTableHeader({
	title, 
	column,
	orderByColumn, 
	orderByDirection, 
	onOrderByColumn
}: SortTableHeaderProps) {
	return (
		<TableHeader>
			<div className="flex items-center justify-between">
				{ title }
				{orderByColumn === column && orderByDirection === 'desc' ? (
					<MoveDown
						size={18}
						onClick={() => onOrderByColumn(column)}
					/>
				) : (orderByColumn === column && orderByDirection === 'asc') ? (
					<MoveUp
						size={18}
						onClick={() => onOrderByColumn(column)}
					/>
				) : (
					<ArrowDownUp
						size={18}
						onClick={() => onOrderByColumn(column)}
					/>
				)}
			</div>
		</TableHeader>
	)
}
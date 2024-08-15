"use client"

import { GetTransactionsHistoryType } from "@/app/api/transactions-history/route";
import SkeletonWrapper from "@/components/SkeletonWrapper/SkeletonWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateToUTCDate } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, ColumnFilter, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table"
import { DataTableColumnHeader } from "../datatable/ColumnsHeader";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTableFacetedFilter } from "../datatable/FacetedFilters";
import { Transaction } from "@prisma/client";
import { DataTableViewOptions } from "../datatable/ColumnToggle";
import { Button } from "@/components/ui/button";
import { download, generateCsv, mkConfig } from "export-to-csv"
import { DownloadIcon } from "lucide-react";
import TransactionRowActions from "./TransactionRowActions";

interface TransactionTableProps {
    from: Date;
    to: Date;
}

export type TransactionHistoryRow = GetTransactionsHistoryType[0];

const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true
})

export const columns: ColumnDef<TransactionHistoryRow>[] = [
    {
        accessorKey: "category",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        header: ({ column }) => (
            <DataTableColumnHeader className="flex justify-center px-3" column={column} title="Categoria" />
        ),
        cell: ({ row }) =>
            <div className="flex justify-center gap-2 capitalize">
                {row.original.categoryIcon}
                <div className="capitalize">
                    {row.original.category}
                </div>
            </div>
    },

    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader className="flex justify-center px-3" column={column} title="Descrição" />
        ),
        cell: ({ row }) =>
            <div className="flex justify-center capitalize">
                {row.original.description}
            </div>

    },

    {
        accessorKey: "date",
        header: () => (
            <div className="flex justify-center px-3">
                Data
            </div>
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            const formattedDate = date.toLocaleDateString("default", {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            })
            return (
                <div className="flex justify-center text-muted-foreground" >
                    {formattedDate}
                </div >
            )
        }
    },

    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader className="flex justify-center px-3" column={column} title="Tipo" />
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        cell: ({ row }) => {
            const type = row.getValue<string>("type");
            return (
                <div className="flex justify-center">
                    {type === "renda" ? (
                        <Badge className="flex justify-center items-center capitalize border-emerald-500 w-20 py-1 text-emerald-400 hover:text-emerald-500 shadow-sm shadow-emerald-400" variant={"outline"}>
                            Renda
                        </Badge>
                    ) : (
                        <Badge className="flex justify-center items-center capitalize border-red-500 w-20 py-1 text-red-400 hover:text-red-500 shadow-sm shadow-red-400" variant={"outline"}>
                            Despesa
                        </Badge>

                    )}
                </div>
            )
        }
    },

    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader className="flex justify-center px-3" column={column} title="Valor" />
        ),
        cell: ({ row }) =>
            <div className="flex justify-center capitalize">
                {row.original.formattedAmount}
            </div>
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) =>
           <TransactionRowActions transaction={row.original}></TransactionRowActions>
    }
]

const TransactionTable = ({ from, to }: TransactionTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const history = useQuery({
        queryKey: ["transactions", "history", from, to],
        queryFn: () => fetch(`/api/transactions-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json()),
    })
    const emptyData: any[] = [];

    const handleExportCSV = (data: any[]) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv)
    }

    const table = useReactTable({
        data: history.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 8
            }
        },
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

    });

    const categoriesOptions = useMemo(() => {
        const categories = new Map();
        history.data?.forEach((transaction: Transaction) => {
            categories.set(transaction.category, {
                value: transaction.category,
                label: `${transaction.categoryIcon} ${transaction.category}`
            });
        });
        const uniqueCategories = new Set(categories.values());
        return Array.from(uniqueCategories);
    }, [history.data]);

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-end justify-between gap-2 py-4">
                <div className="flex gap-2">
                    {table.getColumn("category") && (
                        <DataTableFacetedFilter title="Categoria" column={table.getColumn("category")}
                            options={categoriesOptions}
                        />
                    )}
                    {table.getColumn("type") && (
                        <DataTableFacetedFilter title="Tipo" column={table.getColumn("type")}
                            options={[
                                { label: "Renda", value: "renda" },
                                { label: "Despesa", value: "despesa" },
                            ]}
                        />
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant={"outline"} size={"sm"} className="ml-auto h-8 lg:flex" onClick={() => {
                        const data = table.getFilteredRowModel().rows.map(row => ({
                            category: row.original.category,
                            categoryIcon: row.original.categoryIcon,
                            description: row.original.description,
                            type: row.original.type,
                            amount: row.original.amount,
                            formattedAmount: row.original.formattedAmount,
                            date: row.original.date
                        }))
                        handleExportCSV(data)
                    }}><DownloadIcon className="mr-2 h-4 w-4" />Exportar CSV</Button>
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <SkeletonWrapper isLoading={history.isFetching}>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="ml-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Não foram encontrados dados de transações...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </SkeletonWrapper >
        </div >
    )
}

export default TransactionTable;
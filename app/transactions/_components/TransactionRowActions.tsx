import { useState } from "react";
import { TransactionHistoryRow } from "./TransactionTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import DeleteTransactionDialog from "./DeleteTransactionDialog";


const TransactionRowActions = ({ transaction }: { transaction: TransactionHistoryRow }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    return (
        <>
        <DeleteTransactionDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} transactionId={transaction.id}></DeleteTransactionDialog>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-center">Ações</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="flex items-center gap-2 " onSelect={() => {setShowDeleteDialog(prev => !prev)}}>
                    <TrashIcon className={"h-4 w-4 text-muted-foreground"}/>
                    Deletar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    );
}

export default TransactionRowActions;
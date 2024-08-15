import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteTransaction } from "../actions/deleteTransaction";

interface DeleteTransactionDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    transactionId: string;
}

const DeleteTransactionDialog = ({ open, setOpen, transactionId }: DeleteTransactionDialogProps) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteTransaction,
        onSuccess: async () => {
            toast.success("Transação deletada com sucesso", {
                id: transactionId,
            });
            await queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
        },
        onError: () => {
            toast.error("Aconteceu um erro ao deletar a transação, tente novamente...", {
                id: transactionId
            })
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Tem certeza que deseja deletar a transação?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Sua categoria será deletada permanentemente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600 " onClick={() => {
                        toast.loading(`Deletando transação...`, {
                            id: transactionId
                        })
                        deleteMutation.mutate(
                            transactionId
                        )
                    }}>
                        Deletar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteTransactionDialog;
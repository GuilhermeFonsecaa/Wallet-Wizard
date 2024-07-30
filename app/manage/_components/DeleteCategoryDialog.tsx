"use client"

import { Category } from "@prisma/client";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { DeleteCategory } from "../_actions/deleteCategory";
import { toast } from "sonner";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TransactionType } from "@/lib/types";

interface DeleteCategoryDialogProps {
    trigger: ReactNode;
    category: Category
}

const DeleteCategoryDialog = ({ trigger, category }: DeleteCategoryDialogProps) => {
    const queryClient = useQueryClient();
    const categoryIdentifier = `${category.name} - ${category.type}`

    const deleteCategory = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async () => {
            toast.success("Categoria deletada com sucesso", {
                id: categoryIdentifier,
            });
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
        onError: () => {
            toast.error("Aconteceu um erro ao deletar a categoria, tente novamente...", {
                id: categoryIdentifier
            })
        }
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Tem certeza que deseja deletar a categoria {category.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Sua categoria será deletada permanentemente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600 " onClick={() => {
                        toast.loading(`Deletando categoria...`, {
                            id: categoryIdentifier
                        })
                        deleteCategory.mutate({
                            name: category.name,
                            type: category.type as TransactionType
                        })
                    }}>
                        Remover
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteCategoryDialog;
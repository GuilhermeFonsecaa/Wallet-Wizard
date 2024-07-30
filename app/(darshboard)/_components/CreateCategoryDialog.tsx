"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import React, { ReactNode, useCallback } from "react";
import { useForm } from "react-hook-form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from "../_actions/categories";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Props {
  type: TransactionType;
  successCallback: (category: Category) => void;
  trigger?: ReactNode
}

const CreateCategoryDialog = ({ type, successCallback, trigger }: Props) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Categoria ${data.name} criada com sucesso 🎉`, {
        id: "create-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },

    onError: () => {
      toast.error("Algo deu errado", {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading("Criando Categoria...", {
        id: "create-category",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button
          variant={"ghost"}
          className="flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground"
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Criar nova categoria
        </Button>}
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Criar categoria{" "}
            <span
              className={cn(
                "m-1",
                type === "renda" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
          </DialogTitle>
          <DialogDescription>
            Categorias são usadas para agrupar suas transações
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control} //controle pela const form
              name="name" //nome no esquema de validação
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Categoria"
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Nome da Categoria (obrigatório)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control} //controle pela const form
              name="icon" //nome no esquema de validação
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className="h-24 w-full">
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Clique para mudar
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-12 w-12" />
                              <p className="text-xs text-muted-foreground">
                                Clique para selecionar
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          theme={theme.resolvedTheme}
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    É assim que sua categoria aparecerá na aplicação
                    (obrigatório)
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex">
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
            type="submit"
          >
            {!isPending && "Criar"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;

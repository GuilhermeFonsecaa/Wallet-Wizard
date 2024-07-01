"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { ReactNode, useCallback } from "react";
import React from "react";
import { Form, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  trigger: ReactNode;
  type: TransactionType;
}

const CreateTransactionDialog = ({ trigger, type }: Props) => {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema), //resolver:função para resolver a validação dos dados do formulário.
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const handleCategoryChange = useCallback((value: string) => {
    form.setValue("category", value);
  }, [form]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar uma nova{" "}
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
            Preencha os campos abaixo para criar uma nova renda
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control} //controle pela const form
              name="description" //nome no esquema de validação
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Descrição da transação (opcional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control} //controle pela const form
              name="amount" //nome no esquema de validação
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Valor da transação (obrigatório)
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex items-center">
              <FormField
                control={form.control} //controle pela const form
                name="category" //nome no esquema de validação
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-3">Categoria</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Selecione a categoria da transação
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control} //controle pela const form
              name="description" //nome no esquema de validação
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Descrição da transação (opcional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control} //controle pela const form
              name="date" //nome no esquema de validação
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Calendar {...field} />
                  </FormControl>
                  <FormDescription>Data da transação</FormDescription>
                </FormItem>
              )}
            />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;

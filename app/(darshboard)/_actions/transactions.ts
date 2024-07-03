"use server"

import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
    const parseBody = CreateTransactionSchema.safeParse(form);

    if (!parseBody.success) {
        throw new Error(parseBody.error.message);
    }

    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const { amount, category, date, description, type } = parseBody.data;

    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category,
        }
    })

    if (!categoryRow) {
        throw new Error("Categoria não encontrada")
    }

    // executar múltiplas operações de banco de dados como uma única transação atômica,garante que todas as operações sejam concluídas com sucesso, ou nenhuma delas será aplicada.
    await prisma.$transaction([
        //create user transaction
        prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                date,
                description: description || "",
                type,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon
            },
        }),

        //update month aggregate table
        //update e insert na tabela, se o registro já existir será atualziado, se não um novo registro será criado
        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "despesa" ? amount : 0,
                income: type === "renda" ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === "despesa" ? amount : 0,
                },
                income: {
                    increment: type === "renda" ? amount : 0,
                },
            },
        }),

        //Update year aggregate table
        //update e insert na tabela, se o registro já existir será atualziado, se não um novo registro será criado
        prisma.yearHistory.upsert({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "despesa" ? amount : 0,
                income: type === "renda" ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === "despesa" ? amount : 0,
                },
                income: {
                    increment: type === "renda" ? amount : 0
                }
            }
        })

    ]);
};
import { GetFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        redirect("sign-in");
    };

    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const queryParams = OverviewQuerySchema.safeParse({ from, to })

    if (!queryParams.success) {
        throw new Error(queryParams.error.message)
    }

    const transactionsHistory = await getTransactionsHistory(
        user.id,
        queryParams.data.from,
        queryParams.data.to,
    );

    return Response.json(transactionsHistory);
}

export type GetTransactionsHistoryType = Awaited<ReturnType<typeof getTransactionsHistory>>

const getTransactionsHistory = async (userId: string, from: Date, to: Date) => {
    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId
        }
    })

    if (!userSettings) {
        throw new Error("Configurações do usuário não encontrada")
    }

    const formatter = GetFormatterForCurrency(userSettings.currency);

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: from,
                lte: to
            }
        },
        orderBy: {
            date: "desc"
        }
    })

    return transactions.map(transactions => ({
        ...transactions,
        formattedAmount: formatter.format(transactions.amount)
    }))

}
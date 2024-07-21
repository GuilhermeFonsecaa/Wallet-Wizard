import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }

    const period = await getHistoryPeriods(user.id)

    return Response.json(period);
}

export type GetHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryPeriods>>;

const getHistoryPeriods = async (userId: string) => {
    //busca todos os anos que possuem históricos de transações em algum mês
    const result = await prisma.monthHistory.findMany({
        select: {
            year: true
        },
        where: {
            userId: userId
        },
        distinct: ["year"],
        orderBy: [
            {
                year: "asc"
            }
        ]
    })

    const years = result.map((el) => el.year); //retorna todos os anos que possuem historicos de transacoes em algum mês 
    if (years.length === 0) {
        return [new Date().getFullYear()];
    }
    return years;
}

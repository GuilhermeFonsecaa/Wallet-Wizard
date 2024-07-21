import prisma from "@/lib/prisma";
import { Period, Timeframe } from "@/lib/types";
import { getHistorySchema } from "@/schema/historyData";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe")
    const year = searchParams.get("year");
    const month = searchParams.get("month")

    const queryParams = getHistorySchema.safeParse({
        timeframe,
        year,
        month,
    });

    if (!queryParams.success) {
        return Response.json(queryParams.error.message, {
            status: 400
        })
    }

    const data = await getHistoryData(user.id, queryParams.data.timeframe, {
        year: queryParams.data.year,
        month: queryParams.data.month,
    });

    return Response.json(data);

}

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>

const getHistoryData = async (userId: string, timeframe: Timeframe, period: Period) => {
    switch (timeframe) {
        case "year":
            return await getYearHistoryData(userId, period.year);
        case "month":
            return await getMonthHistoryData(userId, period.year, period.month);
    }

}

type HistoryData = {
    expense: number,
    income: number,
    year: number,
    month: number,
    day?: number
}

const getYearHistoryData = async (userId: string, year: number) => {
    //consulta para pegar os dados de renda e despesa de cada mês do ano
    const result = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: {
            userId,
            year
        },
        _sum: {
            expense: true,
            income: true
        },
        orderBy: [
            {
                month: "asc"
            }
        ]
    })

    if (!result || result.length === 0) {
        return [];
    }

    const history: HistoryData[] = [];

    //passa pelos meses, pegando a soma de renda e despesa de cada um
    for (let i = 0; i < 12; i++) {
        let expense = 0;
        let income = 0;

        const month = result.find((result) => result.month === i) //verifica se possui o mês no yearHistory se possuir pega a soma de renda e despesa, se não renda e despesa é 0
        if (month) {
            expense = month._sum.expense || 0;
            income = month._sum.income || 0;
        }

        //adiciona no array history os dados de renda e despesa de cada mês do ano
        history.push({
            year: year,
            month: i,
            expense,
            income
        })
    }

    return history;
}

const getMonthHistoryData = async (userId: string, year: number, month: number) => {
    const result = await prisma.monthHistory.groupBy({
        by: ["day"],
        where: {
            userId,
            month,
            year
        },
        _sum: {
            expense: true,
            income: true,
        },
        orderBy: [
            {
                day: "asc",
            },
        ],
    });

    if (!result || result.length === 0) {
        return [];
    }

    const history: HistoryData[] = [];

    const daysInMonth = getDaysInMonth(new Date(year, month));

    for (let i = 1; i <= daysInMonth; i++) {
        let expense = 0;
        let income = 0;

        const day = result.find((result) => result.day === i);
        if (day) {
            expense = day._sum.expense || 0;
            income = day._sum.income || 0;
        }

        history.push({
            expense,
            income,
            year:year,
            month: month,
            day: i
        })
    }

    return history;
}




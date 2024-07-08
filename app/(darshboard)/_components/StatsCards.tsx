"use client"

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper/SkeletonWrapper";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, WalletIcon } from "lucide-react";
import { useMemo } from "react";
import StatsCard from "./StatsCard";

interface StatsCardsProps {
    userSettings: UserSettings,
    from: Date,
    to: Date
}

const StatsCards = ({ userSettings, from, to }: StatsCardsProps) => {

    const statsQuery = useQuery<GetBalanceStatsResponseType>({
        queryKey: ["overview", "stats", from, to],
        queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
        ).then((res) => res.json()),
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency)
    }, []);

    const renda = statsQuery.data?.renda || 0;
    const despesa = statsQuery.data?.despesa || 0;

    const balance = renda - despesa;

    return (
        <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatsCard
                    formatter={formatter}
                    value={renda}
                    title="Renda"
                    icon={
                        <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
                    } />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatsCard
                    formatter={formatter}
                    value={despesa}
                    title="Despesa"
                    icon={
                        <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
                    } />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatsCard
                    formatter={formatter}
                    value={balance}
                    title="Saldo"
                    icon={
                        <WalletIcon className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
                    } />
            </SkeletonWrapper>
        </div>
    );
}

export default StatsCards;
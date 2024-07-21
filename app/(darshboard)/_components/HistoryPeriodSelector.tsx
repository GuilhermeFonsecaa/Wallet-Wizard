"use client"

import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import SkeletonWrapper from "@/components/SkeletonWrapper/SkeletonWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";

interface HistoryPeriodSelectorProps {
    period: Period;
    setPeriod: (period: Period) => void;
    timeframe: Timeframe;
    setTimeframe: (timeFrame: Timeframe) => void
}

const HistoryPeriodSelector = ({ period, setPeriod, timeframe, setTimeframe }: HistoryPeriodSelectorProps) => {

    const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
        queryKey: ["overview", "history", "periods"],
        queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
    });

    return (
        <div className="flex flex-wrap items-center gap-4">
            <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as Timeframe)}>
                    <TabsList>
                        <TabsTrigger value="year">Ano</TabsTrigger>
                        <TabsTrigger value="month">Mês</TabsTrigger>
                    </TabsList>
                </Tabs>
                <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                    <YearSelector period={period} setPeriod={setPeriod} years={historyPeriods.data || []} />
                </SkeletonWrapper>
                {timeframe === "month" && (
                    <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                        <MonthSelector period={period} setPeriod={setPeriod}></MonthSelector>
                    </SkeletonWrapper>
                )}
            </SkeletonWrapper>
        </div>
    );
}

export default HistoryPeriodSelector;
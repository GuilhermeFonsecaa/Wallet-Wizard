"use client"

import { Card, CardTitle } from "@/components/ui/card";
import { ReactNode, useCallback } from "react";
import CountUp from 'react-countup';

interface StatsCardProps {
    formatter: Intl.NumberFormat,
    value: number,
    title: string,
    icon: ReactNode,
}

const StatsCard = ({ formatter, value, title, icon }: StatsCardProps) => {
    const formatFn = useCallback((value: number) => {
        return formatter.format(value)
    }, [formatter])

    return (
        <Card className="flex h-24 w-full items-center gap-3 p-4">
            {icon}
            <div className="flex flex-col items-start gap-0">
            <CardTitle className="text-muted-foreground">{title}</CardTitle>
            <CountUp preserveValue
                redraw={false}
                end={value}
                decimals={2}
                formattingFn={formatFn} 
                className="text-2xl"/>
                </div>
        </Card>
    );
}

export default StatsCard;
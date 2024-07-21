"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Period } from "@/lib/types";

interface MonthSelectorProps {
    period: Period,
    setPeriod: (period: Period) => void,
}


const MonthSelector = ({ period, setPeriod }: MonthSelectorProps) => {
    const monthArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return (
        <Select value={period.month.toString()} onValueChange={(value) => {
            setPeriod({
                month: parseInt(value),
                year: period.year
            })
        }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {monthArray.map((month) => {
                    const monthStr = new Date(period.year, month, 1).toLocaleString("default", { month: "long" })
                    return (
                        <SelectItem key={month} value={month.toString()} className="capitalize">{monthStr}</SelectItem>
                    );
                })}
            </SelectContent>
        </Select>

    );
}

export default MonthSelector;
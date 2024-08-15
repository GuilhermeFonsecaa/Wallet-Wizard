"use client"

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import TransactionTable from "./_components/TransactionTable";

interface DateRangeProps {
    from: Date;
    to: Date;
}

const page = () => {
    const [dateRange, setDateRange] = useState<DateRangeProps>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    return (
        <>
            <div className="border-b border-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <div>
                        <p className="text-3xl font-bold">Histórico de transações</p>
                    </div>
                    <DateRangePicker
                        initialDateFrom={dateRange.from}
                        initialDateTo={dateRange.to}
                        showCompare={false}
                        onUpdate={(values) => {
                            const { from, to } = values.range;
                            if (!from || !to) {
                                return;
                            }
                            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                                toast.error(
                                    `O intervalo de datas foi ultrapassado. O intervalo máximo entre datas é de ${MAX_DATE_RANGE_DAYS} dias!`
                                );
                                return;
                            }
                            setDateRange({ from, to })
                        }}
                    />
                </div>
            </div>
            <div className="container">
                <TransactionTable from={dateRange.from} to={dateRange.to}></TransactionTable>
            </div>
        </>
    );
}

export default page;
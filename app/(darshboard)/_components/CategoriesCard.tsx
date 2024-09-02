import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionType } from "@/lib/types";

interface CategoriesCardProps {
    type: TransactionType,
    formatter: Intl.NumberFormat,
    data: GetCategoriesStatsResponseType
}

const CategoriesCard = ({ type, formatter, data }: CategoriesCardProps) => {
    const filteredData = data.filter((t) => t.type === type); //verifica se possui categorias do tipo renda e despesa 
    const total = filteredData.reduce((acc, t) => acc + (t._sum?.amount || 0), 0); //total de renda e despesa

    return (
        <Card className="h-80 w-full">
            <CardHeader>
                <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col text-2xl">
                    {type === "renda" ? "Rendas por categoria" : "Despesas por categoria"}
                </CardTitle>
            </CardHeader>
            <div className="flex items-center justify-between gap-2">
                {filteredData.length === 0 && (
                    <div className="flex h-60 w-full flex-col items-center justify-center">
                        Não existem dados para o período selecionado
                        <p className="text-sm text-muted-foreground">
                            Tente selecionar um período diferente ou adicione uma nova {type === "renda" ? "renda" : "despesa"}
                        </p>
                    </div>
                )}
                {filteredData.length > 0 && (
                    <ScrollArea className="h-60 w-full px-4">
                        <div className="flex w-full flex-col gap-4 p-4">
                            {filteredData.map(item => {
                                const amount = item._sum.amount || 0; //valor total que possui em cada categoria
                                const percentage = (amount * 100) / (total || amount); //valor total de cada categoria * 100 / total do tipo da categoria
                                return (
                                    <div key={item.category} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="flex text-base items-center text-gray-400">
                                                {item.categoryIcon} {item.category}
                                                <span className="ml-2 text-sm text-muted-foreground mt-0.5">
                                                    ({percentage.toFixed(0)}%)
                                                </span>
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                {formatter.format(amount)}
                                            </span>
                                        </div>
                                        <Progress className="h-5" value={percentage} indicator={type === "renda" ? "bg-emerald-500" : "bg-red-500"}/>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </Card>
    );
}

export default CategoriesCard;
"use client"
import CreateCategoryDialog from "@/app/(darshboard)/_components/CreateCategoryDialog";
import SkeletonWrapper from "@/components/SkeletonWrapper/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrendingDown, TrendingUp } from "lucide-react";
import CategoryCard from "./CategoryCard";

const CategoryList = ({ type }: { type: TransactionType }) => {
    const categoriesQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    })

    const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0

    return (
        <SkeletonWrapper isLoading={categoriesQuery.isFetching}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            {type === "despesa" ? (<TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />) : (<TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />)}
                            <div>
                                Categorias de {type === "renda" ? "Rendas" : "Despesas"}
                                <div className="text-sm text-muted-foreground">
                                    Classificadas por nome
                                </div>
                            </div>
                        </div>
                        <CreateCategoryDialog type={type} successCallback={() => categoriesQuery.refetch()}
                            trigger={
                                <Button className="gap-2 text-sm">
                                    <PlusSquare className="mr-2 h-4 w-4" />
                                    Criar Categoria
                                </Button>} />

                    </CardTitle>
                </CardHeader>
                <Separator />
                {!dataAvailable && (
                    <div className="flex h-40 w-full flex-col items-center justify-center">
                        <p>No <span className={cn("m-1", type === "renda" ? "text-emerald-500" : "text-red-500")}>{type}</span></p>
                    </div>
                )}
                {dataAvailable && (
                    <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {categoriesQuery.data.map((category: Category) => (
                            <CategoryCard category={category} key={category.name}/>
                        ))}
                    </div>
                )}
            </Card>
        </SkeletonWrapper>
    );
}

export default CategoryList;
"use client";

import { CurrencyCombobox } from "@/components/CurrencyCombobox/CurrencyCombobox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryList from "./_components/CategoryList";

const page = () => {
    return (
        <>
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <div>
                        <p className="text-3xl font-bold">Gerenciar</p>
                        <p className="text-muted-foreground">
                            Gerencie as configurações e categorias da sua conta
                        </p>
                    </div>
                </div>
            </div>

            <div className="container flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Moeda</CardTitle>
                        <CardDescription>Selecione sua moeda padrão para transações</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CurrencyCombobox />
                    </CardContent>
                </Card>
                <CategoryList type="renda" />
                <CategoryList type="despesa" />

            </div>
        </>
    );
}

export default page;
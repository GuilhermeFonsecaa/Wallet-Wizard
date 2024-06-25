"use server"

import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings"
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
    // Valida o objeto { currency } contra o esquema UpdateUserCurrencySchema
    const parseBody = UpdateUserCurrencySchema.safeParse({
        currency,
    });

    //Verifica se a validação foi bem-sucedida
    if (!parseBody.success) {
        throw parseBody.error;
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }

    const userSettings = await prisma.userSettings.update({
        where: {
            userId: user.id,
        },
        data: {
            currency,
        },
    });

    return userSettings;
}
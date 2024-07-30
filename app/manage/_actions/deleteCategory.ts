"use server"

import prisma from "@/lib/prisma";
import { DeleteCategorySchema, DeleteCategorySchemaType } from "@/schema/categories"
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function DeleteCategory(form: DeleteCategorySchemaType)  {
    const parseBody = DeleteCategorySchema.safeParse(form);
    if (!parseBody.success) {
        throw new Error("Bad Request");
    }
    const user = await currentUser();
    if (!user) {
        redirect("sign-in");
    }

    return await prisma.category.delete({
        where: {
            name_userId_type: {
                userId: user.id,
                name: parseBody.data.name,
                type: parseBody.data.type
            }
        }
    })

}
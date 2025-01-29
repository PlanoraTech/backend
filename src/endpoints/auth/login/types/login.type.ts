import { Prisma } from "@prisma/client";

export type ExtendedLogin = Prisma.TokensGetPayload<{
    include: {
        user?: {
            select: {
                role?: boolean,
                institutions?: {
                    select: {
                        id?: true,
                    },
                },
            },
        },
    },
}>;
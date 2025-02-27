import { Prisma } from "@prisma/client";

export type ExtendedLogin = Prisma.TokensGetPayload<{
    include: {
        user?: {
            select: {
                institutions?: {
                    select: {
                        institutionId?: boolean,
                        role?: boolean,
                        presentatorId?: boolean,
                    },
                },
            },
        },
    },
}>;
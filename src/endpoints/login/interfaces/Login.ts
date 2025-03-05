import { Tokens } from "@prisma/client";

export interface Login extends Partial<Tokens> {
    user: {
        institutions: {
            institutionId: string,
            role: string,
            presentatorId: string | null,
        }[],
    } | null,
}
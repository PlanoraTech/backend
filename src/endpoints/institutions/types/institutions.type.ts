import { Prisma } from "@prisma/client"

export type ExtendedInstitutions = Prisma.InstitutionsGetPayload<{
    include: {
        presentators?: {
            select: {
                id?: boolean,
                name?: boolean,
                appointments?: {
                    select: {
                        id?: boolean,
                        subject?: {
                            select: {
                                id?: boolean,
                                name?: boolean,
                                subjectId?: boolean,
                            }
                        },
                        presentators?: {
                            select: {
                                id?: boolean,
                                name?: boolean,
                            }
                        },
                        rooms?: {
                            select: {
                                id?: boolean,
                                name?: boolean,
                                isAvailable?: boolean,
                            }
                        },
                        dayOfWeek?: boolean,
                        start?: boolean,
                        end?: boolean,
                        isCancelled?: boolean,
                        timetables?: boolean,
                    },
                },
            },
        },
        subjects?: {
            select: {
                id?: boolean,
                name?: boolean,
                subjectId?: boolean,
                appointments?: boolean,
            },
        },
        rooms?: {
            select: {
                id?: boolean,
                name?: boolean,
                isAvailable?: boolean,
                appointments?: {
                    select: {
                        id?: boolean,
                        subject?: {
                            select: {
                                id?: boolean,
                                name?: boolean,
                                subjectId?: boolean,
                            }
                        },
                        presentators?: {
                            select: {
                                id?: boolean,
                                name?: boolean,
                            }
                        },
                        rooms?: {
                            select: {
                                id?: boolean,
                                name?: boolean,
                                isAvailable?: boolean,
                            }
                        },
                        dayOfWeek?: boolean,
                        start?: boolean,
                        end?: boolean,
                        isCancelled?: boolean,
                        timetables?: boolean,
                    },
                },
            },
        },
        timetables?: {
            select: {
                id?: boolean,
                name?: boolean,
                events?: {
                    select: {
                        id?: boolean,
                        title?: boolean,
                        date?: boolean,
                    }
                },
                appointments?: {
                    select: {
                        id?: boolean,
                        subject?: {
                            select: {
                                id?: boolean,
                                name?: boolean,
                                subjectId?: boolean,
                            }
                        },
                        presentators?: {
                            select: {
                                id?: boolean,
                                name?: boolean,
                            }
                        },
                        rooms?: {
                            select: {
                                id?: boolean,
                                name?: boolean,
                                isAvailable?: boolean,
                            }
                        },
                        dayOfWeek?: boolean,
                        start?: boolean,
                        end?: boolean,
                        isCancelled?: boolean,
                        timetables?: boolean,
                    },
                },
            },
        },
        users?: {
            select: {
                id?: boolean,
                email?: boolean,
                role?: boolean,
                appointments?: boolean,
            },
        },
    }
}>;
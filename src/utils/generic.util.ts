import { NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
    DefaultArgs,
    PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';
import { AppointmentsDataService } from '@app/interfaces/dataservice.interface';

export const appointmentsSelect: Prisma.AppointmentsSelect = {
    id: true,
};

export const appointmentSelect: Prisma.AppointmentsSelect = {
    id: true,
    start: true,
    end: true,
    subject: {
        select: {
            name: true,
        },
    },
};

export async function getAppointment(
    prisma: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
    >,
    institutionId: string,
    dataService: AppointmentsDataService,
    select: Prisma.AppointmentsSelect = appointmentSelect,
): Promise<
    Prisma.AppointmentsGetPayload<{
        select: typeof select;
    }>
> {
    return await prisma.appointments
        .findUniqueOrThrow({
            select: {
                ...select,
            },
            where: {
                id: dataService.appointmentId,
                timetables: dataService.timetableId
                    ? {
                          some: {
                              id: dataService.timetableId,
                              institutionId: institutionId,
                          },
                      }
                    : Prisma.skip,
                rooms: dataService.roomId
                    ? {
                          some: {
                              id: dataService.roomId,
                              institutionId: institutionId,
                          },
                      }
                    : Prisma.skip,
                presentators: dataService.presentatorId
                    ? {
                          some: {
                              presentator: {
                                  id: dataService.presentatorId,
                                  institutions: {
                                      some: {
                                          id: institutionId,
                                      },
                                  },
                              },
                          },
                      }
                    : Prisma.skip,
            },
        })
        .catch((e) => {
            if (e instanceof PrismaClientKnownRequestError) {
                switch (e.code) {
                    case 'P2025':
                        throw new NotFoundException('Appointment not found');
                }
            }
            throw e;
        });
}

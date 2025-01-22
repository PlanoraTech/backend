import { Injectable } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';
import { TimeTables } from '@prisma/client';
import { InstitutionsService } from '../institutions/institutions.service';
import { GroupsService } from '../groups/groups.service';

interface ITimeTablesService {
  create(createTimetableDto: CreateTimeTableDto);
  findAll(institutionsId: string, optionalParameters?: {
    groupsId?: string,
    select?: {
      name?: boolean;
      groups?: boolean;
      appointments?: {
        select: {
          id?: boolean;
          subject?: boolean;
          presentators?: boolean;
          rooms?: boolean;
          dayOfWeek?: boolean;
          start?: boolean;
          end?: boolean;
          isCancelled?: boolean;
          timetables?: boolean;
        };
      };
    }
  }): Promise<any>;
  findOne(institutionsId: string, id: string, optionalParameters?: {
    groupsId?: string,
    select?: {
      name?: boolean;
      groups?: boolean;
      appointments?: {
        select: {
          id?: boolean;
          subject?: boolean;
          presentators?: boolean;
          rooms?: boolean;
          dayOfWeek?: boolean;
          start?: boolean;
          end?: boolean;
          isCancelled?: boolean;
          timetables?: boolean;
        };
      };
    }
  }): Promise<any>;
  update(id: string, updateTimetableDto: UpdateTimeTableDto);
  remove(id: string);
}

@Injectable()
export class TimeTablesFromInstitutionsService implements ITimeTablesService {
  constructor(private readonly institutionsService: InstitutionsService) { }

  create(createTimetableDto: CreateTimeTableDto): string {
    throw new Error('Method not implemented.');
  }

  async findAll(institutionsId: string, optionalParameters?: {
    groupsId?: string,
    select?: {
      name?: boolean;
      groups?: boolean;
      appointments?: {
        select: {
          id?: boolean;
          subject?: boolean;
          presentators?: boolean;
          rooms?: boolean;
          dayOfWeek?: boolean;
          start?: boolean;
          end?: boolean;
          isCancelled?: boolean;
          timetables?: boolean;
        };
      };
    }
  }): Promise<Partial<TimeTables>[]> {
    return (await this.institutionsService.findOne(institutionsId, {
      timetables: {
        select: {
          id: true,
          ...optionalParameters.select,
        },
      },
    })).timetables;
  }

  async findOne(institutionsId: string, id: string, optionalParameters?: {
    groupsId?: string,
    select?: {
      name?: boolean;
      groups?: boolean;
      appointments?: {
        select: {
          id?: boolean;
          subject?: boolean;
          presentators?: boolean;
          rooms?: boolean;
          dayOfWeek?: boolean;
          start?: boolean;
          end?: boolean;
          isCancelled?: boolean;
          timetables?: boolean;
        };
      };
    }
  }): Promise<any> {
    return (await this.institutionsService.findOne(institutionsId, {
      timetables: {
        select: {
          id: true,
          ...optionalParameters.select,
        },
      },
    })).timetables.find((timetable) => timetable.id === id);
  }

  update(id: string, updateTimetableDto: UpdateTimeTableDto): string {
    return `This action updates a #${id} timetable`;
  }

  remove(id: string): string {
    return `This action removes a #${id} timetable`;
  }
}

@Injectable()
export class TimeTablesFromGroupsService implements ITimeTablesService {
  constructor(private readonly groupsService: GroupsService) { }

  create(createTimetableDto: CreateTimeTableDto): string {
    throw new Error('Method not implemented.');
  }

  async findAll(institutionsId: string, optionalParameters?: {
    groupsId?: string,
    select?: {
      name?: boolean;
      appointments?: {
        select: {
          id?: boolean;
          subject?: boolean;
          presentators?: boolean;
          rooms?: boolean;
          dayOfWeek?: boolean;
          start?: boolean;
          end?: boolean;
          isCancelled?: boolean;
          timetables?: boolean;
        };
      };
    }
  }): Promise<Partial<TimeTables>[]> {
    return (await this.groupsService.findOne(institutionsId, optionalParameters.groupsId, {
      timetables: {
        select: {
          id: true,
          ...optionalParameters.select,
        },
      },
    })).timetables;
  }

  async findOne(institutionsId: string, id: string, optionalParameters?: {
    groupsId?: string,
    select?: {
      name?: boolean;
      appointments?: {
        select: {
          id?: boolean;
          subject?: boolean;
          presentators?: boolean;
          rooms?: boolean;
          dayOfWeek?: boolean;
          start?: boolean;
          end?: boolean;
          isCancelled?: boolean;
          timetables?: boolean;
        };
      };
    }
  }): Promise<any> {
    return (await this.groupsService.findOne(institutionsId, optionalParameters.groupsId, {
      timetables: {
        select: {
          id: true,
          ...optionalParameters.select,
        },
      },
    })).timetables.find((timetable) => timetable.id === id);
  }

  update(id: string, updateTimetableDto: UpdateTimeTableDto): string {
    return `This action updates a #${id} timetable`;
  }

  remove(id: string): string {
    return `This action removes a #${id} timetable`;
  }
}

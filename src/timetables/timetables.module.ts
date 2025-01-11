import { Module } from '@nestjs/common';
import { TimeTablesService } from './timetables.service';
import { TimeTablesController } from './timetables.controller';

@Module({
  controllers: [TimeTablesController],
  providers: [TimeTablesService],
})
export class TimeTablesModule {}

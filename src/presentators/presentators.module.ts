import { Module } from '@nestjs/common';
import { PresentatorsService } from './presentators.service';
import { PresentatorsController } from './presentators.controller';

@Module({
  controllers: [PresentatorsController],
  providers: [PresentatorsService],
})
export class PresentatorsModule {}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresentatorsService } from './presentators.service';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';

@Controller()
export class PresentatorsController {
  constructor(private readonly presentatorsService: PresentatorsService) {}

  @Post()
  create(@Body() createPresentatorDto: CreatePresentatorDto) {
    return this.presentatorsService.create(createPresentatorDto);
  }

  @Get()
  findAll() {
    return this.presentatorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presentatorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresentatorDto: UpdatePresentatorDto) {
    return this.presentatorsService.update(+id, updatePresentatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presentatorsService.remove(+id);
  }
}

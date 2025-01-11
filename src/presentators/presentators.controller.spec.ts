import { Test, TestingModule } from '@nestjs/testing';
import { PresentatorsController } from './presentators.controller';
import { PresentatorsService } from './presentators.service';

describe('PresentatorsController', () => {
  let controller: PresentatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentatorsController],
      providers: [PresentatorsService],
    }).compile();

    controller = module.get<PresentatorsController>(PresentatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

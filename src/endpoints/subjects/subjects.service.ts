import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';

@Injectable()
export class SubjectsService {
	constructor(private institutionsService: InstitutionsService) { }
	create(createSubjectDto: CreateSubjectDto) {
		return 'This action adds a new subject';
	}

	async findAll(institutionsId: string, select?: {
		name?: boolean,
		subjectId?: boolean,
		appointments?: boolean,
		institution?: boolean,
	}) {
		return (await this.institutionsService.findOne(institutionsId, {
			subjects: {
				select: {
					id: true,
					...select,
				}
			},
		})).subjects;
	}

	async findOne(institutionsId: string, id: string, select?: {
		name?: boolean,
		subjectId?: boolean,
		appointments?: boolean,
		institution?: boolean,
	}) {
		return (await this.institutionsService.findOne(institutionsId, {
			subjects: {
				select: {
					id: true,
					...select,
				}
			},
		})).subjects.find((subject) => subject.id === id);
	}

	update(id: string, updateSubjectDto: UpdateSubjectDto) {
		return `This action updates a #${id} subject`;
	}

	remove(id: string) {
		return `This action removes a #${id} subject`;
	}
}
// sub-short-cut.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortCutsModel } from '../entities/shortCut.entity';
import { UsersModel } from '../../users/entities/users.entity';
import { SubShortCutsModel } from '../entities/subShortCut.entity';
import { CreateSubShortCutDto } from '../dtos/CreateSubShortCut.dto';

@Injectable()
export class SubShortCutService {
    constructor(
        @InjectRepository(ShortCutsModel)
        private readonly shortcutsRepository: Repository<ShortCutsModel>,

        @InjectRepository(SubShortCutsModel)
        private readonly subShortCutRepository: Repository<SubShortCutsModel>,

        @InjectRepository(UsersModel)
        private readonly usersRepo: Repository<UsersModel>,
    ) { }

    async createOneSubShortCut(createSubShortCutDto: CreateSubShortCutDto): Promise<SubShortCutsModel> {
        try {
            const { shortcut, description, category, parentId } = createSubShortCutDto;

            console.log("check for createOneSubShortCut ??", parentId);

            // 부모 shortcut 조회
            const parentShortcut = await this.shortcutsRepository.findOne({ where: { id: parentId }, relations: ['writer'] },

            );

            if (!parentShortcut) {
                throw new Error('Parent shortcut not found');
            }

            // 부모 shortcut에 연결된 writer 조회
            const writer = await this.usersRepo.findOne({ where: { id: parentShortcut.writer.id } });

            if (!writer) {
                throw new Error('Writer not found');
            }

            const newSubShortCut = new SubShortCutsModel();
            newSubShortCut.shortcut = shortcut;
            newSubShortCut.description = description;
            newSubShortCut.category = category;
            newSubShortCut.parentShortcut = parentShortcut;
            newSubShortCut.writer = writer;

            return await this.subShortCutRepository.save(newSubShortCut);
        } catch (error) {
            // 오류 발생 시 처리
            console.error('Error in createOneSubShortCut:', error.message);
            throw error; // 호출자에게 오류 전파
        }
    }

}

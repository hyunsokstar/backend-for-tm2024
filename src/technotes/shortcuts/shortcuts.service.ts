import { shortCutListDto } from './../dtos/shortCutList.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortCutsModel } from '../entities/shortCut.entity';
import { CreateOneShortCutDto } from '../dtos/CreateOneShortCut.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { ITypeForShortCutRow, ReponseTypeForGetAllShortCutList } from './types/typeForShortcut';

@Injectable()
export class ShortcutsService {
    constructor(
        @InjectRepository(ShortCutsModel)
        private readonly shortcutsRepository: Repository<ShortCutsModel>,

        @InjectRepository(UsersModel)
        private usersRepo: Repository<UsersModel>,
    ) { }

    async getAllShortcuts(shortCutListDto: shortCutListDto): Promise<ReponseTypeForGetAllShortCutList> {
        const { pageNum, perPage } = shortCutListDto;
        const skip = (pageNum - 1) * perPage;

        // 실제 데이터베이스에서 단축키 목록을 가져옵니다.
        // const [shortcuts, totalCount] = await this.shortcutsRepository.findAndCount({
        //     skip: skip,
        //     take: perPage,
        //     order: { id: 'DESC' }, // 필요에 따라 정렬 조건을 변경할 수 있습니다.
        // });

        // const shortCutList: ITypeForShortCutRow[] = shortcuts.map(shortcut => ({
        //     id: shortcut.id,
        //     shortcut: shortcut.shortcut,
        //     description: shortcut.description,
        //     category: shortcut.category,
        // }));

        let query = this.shortcutsRepository.createQueryBuilder('shortCut')
            .skip((pageNum - 1) * perPage)
            .take(perPage)
            .orderBy('shortCut.id', 'DESC');

        const [shortCutList, totalCount] = await query
            .leftJoinAndSelect('shortCut.writer', 'writer')
            .getManyAndCount();


        // 응답 객체를 생성하여 반환합니다.
        const response: ReponseTypeForGetAllShortCutList = {
            perPage: perPage,
            totalCount: totalCount,
            shortCutList: shortCutList,
        };

        return response;
    }

    async getShortcutById(id: number): Promise<ShortCutsModel> {
        return this.shortcutsRepository.findOne({ where: { id } });
    }

    async createShortcut(createOneShortCutDto: CreateOneShortCutDto): Promise<ShortCutsModel> {
        const { shortcut, description, category, writerId } = createOneShortCutDto;

        // 사용자 ID를 기반으로 사용자 찾기
        const writer = await this.usersRepo.findOne({ where: { id: writerId } });

        // ShortCutsModel 인스턴스 생성 및 속성 설정
        const shortcutEntity = new ShortCutsModel();
        shortcutEntity.shortcut = shortcut;
        shortcutEntity.description = description;
        shortcutEntity.category = category;
        shortcutEntity.writer = writer; // 작성자 할당

        // ShortCutsModel 저장 후 반환
        return this.shortcutsRepository.save(shortcutEntity);
    }

}

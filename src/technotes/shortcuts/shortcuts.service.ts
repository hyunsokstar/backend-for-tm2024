import { shortCutListDto } from './../dtos/shortCutList.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ShortCutsModel } from '../entities/shortCut.entity';
import { CreateOneShortCutDto } from '../dtos/CreateOneShortCut.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { ITypeForShortCutRow, ReponseTypeForGetAllShortCutList } from './types/typeForShortcut';
import { IParameterForSaveShortCuts, ResponseTypeForSaveShorts } from './types/IParameterForSaveShortcuts';

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


    async saveShortCuts({ dataForSaveShortCuts, loginUser }: IParameterForSaveShortCuts)
        : Promise<ResponseTypeForSaveShorts> {
        let count_for_update = 0;

        for (const shortCut of dataForSaveShortCuts) {
            const {
                id: shortCutId,
                email,
                shortcut,
                description,
                category,
                ...data
            } = shortCut

            const writerObj = await this.usersRepo.findOne({
                where: {
                    email: email
                }
            })

            if (shortCutId) { // roadmap 요소중에 id 있는지 확인
                const existingShortCut = await this.shortcutsRepository.findOne({ where: { id: shortCutId } }); // 변경된 부분

                // 기존의 roadMap이 존재할 경우 update
                if (existingShortCut) {
                    count_for_update++;
                    console.log("update here");
                    await this.shortcutsRepository.update(shortCutId, {
                        shortcut,
                        description,
                        category,
                        writer: writerObj
                    });
                }
                else {
                    console.log("save here");
                    count_for_update++;

                    if (!loginUser) {
                        return {
                            success: false,
                            message: `login is required to add tech note`
                        }
                    }

                    await this.shortcutsRepository.save({
                        shortcut,
                        description,
                        category,
                        writer: loginUser
                    });

                    return {
                        success: true,
                        message: "Roadmap added successfully"
                    }
                }

            }

        }

        return {
            success: true,
            message: `road map save is successfully excuted for count ${count_for_update}`
        }
    }

    async deleteForShortCutsForCheckedIds(checkedIds: number[], loginUser): Promise<string | { success: boolean, message: string }> {
        try {
            const notesToDelete = await this.shortcutsRepository.find({
                where: { id: In(checkedIds) },
                relations: ['writer'], // writer 관계를 가져옵니다.
            });

            const filteredNotesToDelete = notesToDelete.filter(todo => todo.writer.email !== loginUser.email);
            console.log("filteredTodosToDelete.length : ", filteredNotesToDelete.length);

            if (filteredNotesToDelete.length > 0) {
                return {
                    success: false,
                    message: `삭제할 권한이 없습니다.`
                };
            }

            const deleteResult = await this.shortcutsRepository.delete(checkedIds);
            console.log("result for delete techNoteRowsForCheckedIds: ", deleteResult);

            const deletedCount = deleteResult.affected ?? 0;
            return { success: true, message: `총 ${deletedCount}개의 roadmap이 삭제되었습니다.` }

        } catch (error) {
            console.log("error : ", error);

            throw new Error('삭제 중 오류가 발생했습니다.');
        }
    }

}

import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoadMapModel } from '../entities/roadMap.entity';
import { CreateRoadMapDto } from '../dtos/createRoadMapDto.dto';
import { RoadMapListDto } from '../dtos/roadMapList.dto';
import { IParameterForSaveRoadMaps, ReponseTypeForGetAllRoadMapList, ResponseTypeForSaveRoadMaps } from './types/TypeForRoadMap';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class RoadmapService {

    constructor(
        @InjectRepository(RoadMapModel)
        private roadMapRepo: Repository<RoadMapModel>,
        @InjectRepository(UsersModel)
        private usersRepo: Repository<UsersModel>,
    ) { }

    async saveRoadMaps({ dtoForSaveRoadMaps, loginUser }: IParameterForSaveRoadMaps): Promise<ResponseTypeForSaveRoadMaps> {
        let count_for_update = 0;

        for (const roadMap of dtoForSaveRoadMaps) {
            const { id: roadMapId, email, title, category, ...data } = roadMap

            const writerObj = await this.usersRepo.findOne({
                where: {
                    email: email
                }
            })

            if (roadMapId) { // roadmap 요소중에 id 있는지 확인
                const existingRoadMap = await this.roadMapRepo.findOne({ where: { id: roadMapId } }); // 변경된 부분

                // 기존의 roadMap이 존재할 경우 update
                if (existingRoadMap) {
                    count_for_update++;
                    console.log("update here");
                    await this.roadMapRepo.update(roadMapId, {
                        title: title,
                        category: category,
                        updatedAt: new Date(),
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

                    await this.roadMapRepo.save({
                        title: title,
                        category: category,
                        createdAt: new Date(),
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

    async getAllRoadMapList(roadMapListDto: RoadMapListDto): Promise<ReponseTypeForGetAllRoadMapList> {
        const { pageNum, perPage } = roadMapListDto;
        const skip = (pageNum - 1) * perPage;

        let query = this.roadMapRepo.createQueryBuilder('roadMap')
            .skip((pageNum - 1) * perPage)
            .take(perPage)
            .orderBy('roadMap.id', 'DESC');


        const [roadMapList, totalCount] = await query
            .leftJoinAndSelect('roadMap.writer', 'writer')
            .leftJoinAndSelect('roadMap.techNotes', 'techNotes')
            .leftJoinAndSelect('techNotes.writer', 'techNoteWriter')
            .leftJoinAndSelect('techNotes.skilnotes', 'techNote.skilnotes')
            .getManyAndCount();

        // console.log("roadMapList ??? ", roadMapList);
        // const techNoteListWithCounts = roadMapList.map(roadMap => {
        //     let techNotes = roadMap.techNotes.map(techNote => {
        //         techNote.countForSkilNotes = techNote.skilnotes.length; // 수정 필요
        //     })
        //     return {
        //         ...roadMap,
        //         techNotes
        //     }
        // });

        return {
            perPage: perPage,
            totalCount: totalCount,
            roadMapList: roadMapList,
        };
    }


    async createRoadMap(createRoadMapDto: CreateRoadMapDto): Promise<RoadMapModel> {
        const { title, description, category, writerId } = createRoadMapDto;

        const writerObj = await this.usersRepo.findOne({ where: { id: writerId } });

        const roadMap = new RoadMapModel();
        roadMap.title = title;
        roadMap.description = description;
        roadMap.category = category;
        roadMap.writer = writerObj;

        return await this.roadMapRepo.save(roadMap);
    }

    // deleteRoadMapsForCheckedRows
    async deleteForRoadMapsForCheckedIds(checkedIds: number[], loginUser): Promise<string | { success: boolean, message: string }> {
        try {
            const notesToDelete = await this.roadMapRepo.find({
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

            const deleteResult = await this.roadMapRepo.delete(checkedIds);
            console.log("result for delete techNoteRowsForCheckedIds: ", deleteResult);

            const deletedCount = deleteResult.affected ?? 0;
            return { success: true, message: `총 ${deletedCount}개의 roadmap이 삭제되었습니다.` }

        } catch (error) {
            console.log("error : ", error);

            throw new Error('삭제 중 오류가 발생했습니다.');
        }
    }

}

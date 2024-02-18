import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoadMapModel } from '../entities/roadMap.entity';
import { CreateRoadMapDto } from '../dtos/createRoadMapDto.dto';
import { RoadMapListDto } from '../dtos/roadMapList.dto';
import { IParameterForSaveRoadMaps, ReponseTypeForGetAllRoadMapList, ResponseTypeForSaveRoadMaps } from './types/TypeForRoadMap';
import { UsersModel } from 'src/users/entities/users.entity';
import { SaveRoadMapsDto } from '../dtos/saveRoadMaps.dto';

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
            .getManyAndCount();

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
}

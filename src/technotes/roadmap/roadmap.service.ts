import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoadMapModel } from '../entities/roadMap.entity';
import { CreateRoadMapDto } from '../dtos/createRoadMapDto.dto';
import { RoadMapListDto } from '../dtos/roadMapList.dto';
import { ReponseTypeForGetAllRoadMapList } from './types/responseType';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class RoadmapService {

    constructor(
        @InjectRepository(RoadMapModel)
        private roadMapRepo: Repository<RoadMapModel>,
        @InjectRepository(UsersModel)
        private usersRepo: Repository<UsersModel>,
    ) { }


    async getAllRoadMapList(roadMapListDto: RoadMapListDto): Promise<ReponseTypeForGetAllRoadMapList> {
        const { pageNum, perPage } = roadMapListDto;
        const skip = (pageNum - 1) * perPage;

        // const totalCount = await this.roadMapRepo.count(); // 전체 아이템 수 계산

        // const roadMapList = await this.roadMapRepo.find({
        //     take: perPage,
        //     skip: skip,
        // });

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

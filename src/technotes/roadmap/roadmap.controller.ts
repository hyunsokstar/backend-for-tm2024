import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadMapModel } from '../entities/roadMap.entity';
import { CreateRoadMapDto } from '../dtos/createRoadMapDto.dto';
import { SaveRoadMapsDto } from '../dtos/saveRoadMaps.dto';

@Controller('roadmap')
export class RoadmapController {
    constructor(private readonly roadMapService: RoadmapService) { }

    @Get('/')
    async getAllRoadMapList(
        @Query('pageNum') pageNum: number,
    ) {
        const perPage = 20;
        const response = await this.roadMapService.getAllRoadMapList({ pageNum, perPage });
        return response;
    }

    @Post()
    async createRoadMap(@Body() createRoadMapDto: CreateRoadMapDto): Promise<RoadMapModel> {
        return await this.roadMapService.createRoadMap(createRoadMapDto);
    }

    @Post('saveRoadMaps')
    async saveRoadMaps(
        @Body() dtoForSaveRoadMaps: SaveRoadMapsDto[],
        @Req() req
    ) {
        return this.roadMapService.saveRoadMaps(
            {
                dtoForSaveRoadMaps,
                loginUser: req.user
            }
        );
    }

    @Delete('deleteRoadMapsForCheckedRows')
    async deleteRoadMapsForCheckedRows(@Body('checkedIds') checkedIds: number[], @Req() req) {
        try {
            console.log("유저 삭제 요청 받음");
            const loginUser = req.user
            if (!req.user) {
                return {
                    message: "로그인 하세요"
                }
            }
            return await this.roadMapService.deleteForRoadMapsForCheckedIds(checkedIds, loginUser);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // roadMapId 와 userId 를 받아서 user 를 roadMap 의 participant model 인 ParticipantsForRoadMapModel 에 등록 하려고 해 
    // 그렇다면 컨트롤러에서 roadMapId 와 userId 를 어떻게 받아야 될까?
    // axios api 요청은 어떻게 날려야 될까?
    @Post('participants')
    async addParticipantsToRoadMap(@Body() data: any) {
        const { roadMapId, userId } = data; // 요청 바디에서 roadMapId와 userId를 추출합니다.
        // ParticipantsForRoadMapModel에 등록하는 로직을 작성합니다.

        return await this.roadMapService.addParticipantsToRoadMap(roadMapId, userId);

    }


}

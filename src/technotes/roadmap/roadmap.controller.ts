import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadMapModel } from '../entities/roadMap.entity';
import { CreateRoadMapDto } from '../dtos/createRoadMapDto.dto';

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

}

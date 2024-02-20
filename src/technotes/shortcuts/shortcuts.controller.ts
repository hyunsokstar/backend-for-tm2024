import { Controller, Get, Post, Body, Param, Query, Req, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { ShortcutsService } from './shortcuts.service';
import { ShortCutsModel } from '../entities/shortCut.entity';
import { CreateOneShortCutDto } from '../dtos/CreateOneShortCut.dto';
import { SaveShortCutsDto } from '../dtos/saveShortCut.dto';

@Controller('shortcuts')
export class ShortcutsController {
    constructor(private readonly shortcutsService: ShortcutsService) { }

    @Get()
    async getAllShortCutsList(
        @Query('pageNum') pageNum: number,
    ) {
        const perPage = 20;
        const response = await this.shortcutsService.getAllShortcuts({ pageNum, perPage });
        return response;
    }

    @Get(':id')
    async get(@Param('id') id: number): Promise<ShortCutsModel> {
        return this.shortcutsService.getShortcutById(id);
    }

    @Post()
    async createOne(@Body() createOneShortCutDto: CreateOneShortCutDto): Promise<ShortCutsModel> {
        return this.shortcutsService.createShortcut(createOneShortCutDto);
    }

    @Post('saveShortCuts')
    async saveShortCuts(
        @Body() dataForSaveShortCuts: SaveShortCutsDto[],
        @Req() req
    ) {
        return this.shortcutsService.saveShortCuts(
            {
                dataForSaveShortCuts,
                loginUser: req.user
            }
        );
    }

    @Delete('deleteShortCutsForCheckedRows')
    async deleteRoadMapsForCheckedRows(@Body('checkedIds') checkedIds: number[], @Req() req) {
        try {
            console.log("유저 삭제 요청 받음");
            const loginUser = req.user
            if (!req.user) {
                return {
                    message: "로그인 하세요"
                }
            }
            return await this.shortcutsService.deleteForShortCutsForCheckedIds(checkedIds, loginUser);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

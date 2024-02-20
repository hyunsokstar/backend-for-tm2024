import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ShortcutsService } from './shortcuts.service';
import { ShortCutsModel } from '../entities/shortCut.entity';
import { CreateOneShortCutDto } from '../dtos/CreateOneShortCut.dto';

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


}

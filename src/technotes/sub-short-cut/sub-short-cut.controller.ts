// sub-short-cut.controller.ts
import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { SubShortCutService } from './sub-short-cut.service';
import { CreateSubShortCutDto } from '../dtos/CreateSubShortCut.dto';

@Controller('subShortCuts')
export class SubShortCutController {
    constructor(private readonly subShortCutService: SubShortCutService) { }

    @Post()
    async createOneSubShortCut(@Body() createSubShortCutDto: CreateSubShortCutDto) {
        try {
            const newSubShortCut = await this.subShortCutService.createOneSubShortCut(createSubShortCutDto);
            return {
                success: true,
                data: newSubShortCut,
                message: 'Sub shortcut created successfully',
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}

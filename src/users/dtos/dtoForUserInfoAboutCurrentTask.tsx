import { IsBoolean, IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';

export class DtoForUserInfoAboutCurrentTask {
    @IsBoolean()
    isOnline: boolean;

    @IsOptional()
    @IsString()
    currentTask?: string | null;

    @IsNumber()
    currentTaskProgressPercent: number;

    @IsEnum(['struggling', 'offroad', 'ninja', 'cheetah', 'rocket'])
    performanceLevel: 'struggling' | 'offroad' | 'ninja' | 'cheetah' | 'rocket';
}
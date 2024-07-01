import { IsEnum, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserInfoAboutCurrentStatusDto {
    @IsEnum(['profileImage', 'isOnline', 'currentTask', 'currentTaskProgressPercent', 'performanceLevel'])
    targetField: 'profileImage' | 'isOnline' | 'currentTask' | 'currentTaskProgressPercent' | 'performanceLevel';

    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsOptional()
    @IsBoolean()
    isOnline?: boolean;

    @IsOptional()
    @IsString()
    currentTask?: string | null;

    @IsOptional()
    @IsNumber()
    currentTaskProgressPercent?: number;

    @IsOptional()
    @IsEnum(['struggling', 'offroad', 'ninja', 'cheetah', 'rocket'])
    performanceLevel?: 'struggling' | 'offroad' | 'ninja' | 'cheetah' | 'rocket';
}
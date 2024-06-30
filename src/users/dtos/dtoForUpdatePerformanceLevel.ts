import { IsEnum } from 'class-validator';

export class UpdatePerformanceLevelDto {
    @IsEnum(['struggling', 'offroad', 'ninja', 'cheetah', 'rocket'])
    performanceLevel: 'struggling' | 'offroad' | 'ninja' | 'cheetah' | 'rocket';
}
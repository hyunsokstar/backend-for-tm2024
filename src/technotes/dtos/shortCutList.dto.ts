// roadMapList.dto.ts
import { IsInt, IsPositive, Min } from 'class-validator';

export class shortCutListDto {
    @IsInt()
    @IsPositive()
    readonly pageNum: number;

    @IsInt()
    @IsPositive()
    @Min(1)
    readonly perPage: number;
}

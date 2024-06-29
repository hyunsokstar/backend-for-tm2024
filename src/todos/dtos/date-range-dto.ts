import { IsDateString } from 'class-validator';


// src\todos\dtos\date-range-dto.ts
export class DateRangeDto {
    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;
}
import { IsString } from 'class-validator';

export class AddItemToSpecificFieldForTeamDevSpecDto {
    @IsString()
    fieldName: string;

    @IsString()
    itemText: string;
}

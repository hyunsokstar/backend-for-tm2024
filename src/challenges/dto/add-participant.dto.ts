import { IsNotEmpty, IsUrl } from 'class-validator';

export class AddParticipantDto {
    @IsUrl({}, { each: true })
    noteUrl?: string;
}

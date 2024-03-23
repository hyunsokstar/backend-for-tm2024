import { IsNotEmpty, IsUrl } from 'class-validator';

export class AddParticipantDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    subChallengeId: number;

    @IsUrl({}, { each: true })
    noteUrl?: string;
}

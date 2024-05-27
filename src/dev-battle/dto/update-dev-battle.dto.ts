import { PartialType } from '@nestjs/mapped-types';
import { CreateDevBattleDto } from './create-dev-battle.dto';

export class UpdateDevBattleDto extends PartialType(CreateDevBattleDto) {}

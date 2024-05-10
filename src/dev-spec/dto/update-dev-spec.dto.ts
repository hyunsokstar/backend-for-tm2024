import { PartialType } from '@nestjs/mapped-types';
import { CreateDevSpecDto } from './create-dev-spec.dto';

export class UpdateDevSpecDto extends PartialType(CreateDevSpecDto) {}

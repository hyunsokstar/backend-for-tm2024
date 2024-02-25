import { PartialType } from '@nestjs/mapped-types';
import { CreateStarterProjectDto } from './create-starter-project.dto';

export class UpdateStarterProjectDto extends PartialType(CreateStarterProjectDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateDevRelayDto } from './create-dev-relay.dto';

export class UpdateDevRelayDto extends PartialType(CreateDevRelayDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateOpportuniteDto } from './create-opportunite.dto';

export class UpdateOpportuniteDto extends PartialType(CreateOpportuniteDto) {}

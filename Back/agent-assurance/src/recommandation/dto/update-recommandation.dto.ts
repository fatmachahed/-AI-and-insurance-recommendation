import { PartialType } from '@nestjs/mapped-types';
import { CreateRecommandationDto } from './create-recommandation.dto';

export class UpdateRecommandationDto extends PartialType(CreateRecommandationDto) {}

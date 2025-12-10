import { PartialType } from '@nestjs/mapped-types';
import { CreateClientsPhysiqueDto } from './create-clients-physique.dto';

export class UpdateClientsPhysiqueDto extends PartialType(CreateClientsPhysiqueDto) {}

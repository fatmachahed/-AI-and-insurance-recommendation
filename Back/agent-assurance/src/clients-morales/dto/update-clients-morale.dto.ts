import { PartialType } from '@nestjs/mapped-types';
import { CreateClientsMoraleDto } from './create-clients-morale.dto';

export class UpdateClientsMoraleDto extends PartialType(CreateClientsMoraleDto) {}

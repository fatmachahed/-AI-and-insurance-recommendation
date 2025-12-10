import { PartialType } from '@nestjs/mapped-types';
import { CreateMappingProduitDto } from './create-mapping-produit.dto';

export class UpdateMappingProduitDto extends PartialType(CreateMappingProduitDto) {}

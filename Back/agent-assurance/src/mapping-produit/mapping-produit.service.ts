import { Injectable } from '@nestjs/common';
import { CreateMappingProduitDto } from './dto/create-mapping-produit.dto';
import { UpdateMappingProduitDto } from './dto/update-mapping-produit.dto';

@Injectable()
export class MappingProduitService {
  create(createMappingProduitDto: CreateMappingProduitDto) {
    return 'This action adds a new mappingProduit';
  }

  findAll() {
    return `This action returns all mappingProduit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mappingProduit`;
  }

  update(id: number, updateMappingProduitDto: UpdateMappingProduitDto) {
    return `This action updates a #${id} mappingProduit`;
  }

  remove(id: number) {
    return `This action removes a #${id} mappingProduit`;
  }
}

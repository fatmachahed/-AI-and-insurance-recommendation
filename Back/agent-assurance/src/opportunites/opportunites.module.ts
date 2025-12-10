import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunitesService } from './opportunites.service';
import { OpportunitesController } from './opportunites.controller';
import { RecommandationModule } from '../recommandation/recommandation.module';
import { Opportunite } from './entities/opportunite.entity';

@Module({
  imports: [RecommandationModule,TypeOrmModule.forFeature([Opportunite])], 
  controllers: [OpportunitesController],
  providers: [OpportunitesService],
})
export class OpportunitesModule {}

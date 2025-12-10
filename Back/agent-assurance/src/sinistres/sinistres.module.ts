import { Module } from '@nestjs/common';
import { SinistresService } from './sinistres.service';
import { SinistresController } from './sinistres.controller';

@Module({
  controllers: [SinistresController],
  providers: [SinistresService],
})
export class SinistresModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
     
  // Configuration CORS pour autoriser le frontend React
  app.enableCors({
    origin: 'http://localhost:3001', // Autorise uniquement le frontend React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Exécution du seeding des administrateurs
  const seedService = app.get(SeedService);
  await seedService.seedAdmins();

  await app.listen(3000);
  console.log('Application NestJS démarrée sur http://localhost:3000');
}

bootstrap();
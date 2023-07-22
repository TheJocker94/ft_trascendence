import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  await app.listen(3000);
}
bootstrap();

// Per farlo funzionare ho usato cors
// Please note that enabling CORS without any specific configuration (as shown above) will allow any origin to access your backend. In a production environment, you should consider setting up more fine-grained CORS configurations
//based on your specific needs for security.

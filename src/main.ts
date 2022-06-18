import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cors = require('cors')
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(cors());
  await app.listen(process.env.PORT);
}
bootstrap();

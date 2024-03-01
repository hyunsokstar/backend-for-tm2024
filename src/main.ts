import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // 여러 주소를 포함하는 CORS 설정
  const allowedOrigins = ['http://127.0.0.1:3000', 'http://127.0.0.1:3010', 'http://13.209.211.181:3000'];

  app.enableCors({
    origin: allowedOrigins, // 여러 주소를 배열로 추가
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: {
      target: true,
      value: true,
    },
  }));



  await app.listen(8080);
}
bootstrap();

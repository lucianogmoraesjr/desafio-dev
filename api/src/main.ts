import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const description = [
    'Bem-vindo à documentação oficial da API do **psa.finance**.',
    '',
    'Esta API RESTful foi desenvolvida para fornecer todos os recursos necessários para uma aplicação de gestão financeira pessoal.',
    '',
    '### 🔒 Autenticação (JWT)',
    'A maioria das rotas desta API são privadas. Para testá-las, siga este fluxo:',
    '1. Crie uma nova conta utilizando o endpoint `POST /auth/signup`.',
    '2. Faça o login em `POST /auth/signin` para receber o seu `accessToken`.',
    '3. Configure a Autenticação no painel do Scalar inserindo o token recebido.',
    '',
    '### 🚀 Principais Recursos',
    '* **Autenticação & Usuários:** Gestão de sessão e perfil do usuário logado.',
    '* **Contas Bancárias:** Gerenciamento de carteiras, contas correntes e investimentos.',
    '* **Categorias:** Estruturação para classificação de entradas e saídas.',
    '* **Transações:** Registro de receitas e despesas com impacto dinâmico no saldo das contas.',
  ].join('\n');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('psa.finance API - Desafio Técnico')
    .setDescription(description)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  app.use(
    '/docs',
    apiReference({
      content: swaggerDocument,
      setPageTitle: () => 'psa.finance - API Reference',
      localization: { locale: 'pt-BR' },
      withFastify: true,
    }),
  );

  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}

void bootstrap();

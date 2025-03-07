import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { NestFactory } from '@nestjs/core';
import { ImageProxyModule } from '../../src/app.module';
// @ts-ignore
import serverless from 'serverless-http';

let server: any;

async function bootstrap() {
    if (!server) {
        const app = await NestFactory.create(ImageProxyModule);
        app.enableCors();
        await app.init();

        const expressApp = app.getHttpAdapter().getInstance();
        server = serverless(expressApp);
    }

    return server;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const handler = await bootstrap();
    const result = await handler(event, context);
    return {
        ...result,
        statusCode: result.statusCode || 200
    };
};
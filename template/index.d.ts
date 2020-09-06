import { FastifyPlugin } from 'fastify';

declare module 'fastify' {
  export interface FastifyInstance {
    // This is an example decorator type added to fastify
    exampleDecorator: () => string;
  }
}

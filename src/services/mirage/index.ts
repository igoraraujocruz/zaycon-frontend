import { createServer, Factory, Model } from 'miragejs';
import { faker } from '@faker-js/faker';

type Product = {
  name: string;
  price: number;
  description: string;
};

export function makeServer() {
  const server = createServer({
    models: {
      product: Model.extend<Partial<Product>>({}),
    },

    factories: {
      product: Factory.extend({
        name(i: number) {
          return `Product ${i + 1}`;
        },
        price() {
          return faker.random.numeric();
        },
        description() {
          return faker.lorem.paragraph();
        },
      }),
    },

    seeds(server) {
      server.createList('product', 10);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750;

      this.get('/product');
      this.post('/product');

      this.namespace = '';
      this.passthrough();
    },
  });

  return server;
}

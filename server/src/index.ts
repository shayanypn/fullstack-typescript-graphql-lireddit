import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constans';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { nerdvision } from '@nerdvision/agent';

const main = async () => {

    nerdvision.init({
        api_key: 'aa899dcebf837cf83f6c0e8bb5f65a3cc20cff73cd51f90c2a14beb7e19ecde66f2b92717f60b455177549c7045876bf1f6586d338c029029ddaf2bdfdca730a',
        name: 'shayan test project',
        debug: true,
        tags: {
            'test': 'sample one'
        }
    });

    const orm = await MikroORM.init(mikroOrmConfig);
    // await orm.getMigrator().up();

    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })


}

main().catch(err => {
    console.error(err);
});
import { ApolloServer, gql } from 'apollo-server-express'
import { Application, Router } from 'express'
import { generateSchema } from '../../../../utils/graphql/graphql-schema-generator'
import { connect } from '../../../../utils/sequelize/connection'

const router = Router()
export default router.use('/group', Router()
    .get('/', (request, response) => {
        response.json({ rows: [{ id: '1', name: 'dummy val a' }] })
    }).get('/entity', (request, response) => {
        connect('mysql://root@localhost:3306/re_aw2').then(({ sequelize, dbSchema }: any) => {
            const modules = generateSchema(dbSchema, sequelize)
            const apolloServer = new ApolloServer({
                modules,
                playground: {
                    settings: {
                        'editor.theme': 'light'
                    }
                },
            })
            apolloServer.applyMiddleware({ app: router as Application })
        })
        console.log('testing- entity')
        response.json({ rows: [{ id: '1', name: 'entity' }] })
    })
)

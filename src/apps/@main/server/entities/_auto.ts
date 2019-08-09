import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('mysql://root@localhost:3306/re_aw2')
export const testConnectivity = () => {
    console.log('testConnectivity')
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.')
        })
        .catch((err) => {
            console.error('Unable to connect to the database:', err)
        })

    sequelize.query('SELECT * FROM abilities where 1=2').then(([results, metadata]) => {
        console.log(metadata)
    })
}

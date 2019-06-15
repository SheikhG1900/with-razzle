import { APP_PORT } from '_/env'
import ajax from 'axios'

const serverURL = (typeof window === 'undefined') ? `http://localhost:${APP_PORT}` : ''
export default (baseUrl: string) => (endpoint: string, method: string = 'get', data) => {
    console.log({ endpoint, method, data, url: `${serverURL}${baseUrl}${endpoint}` })
    return ajax({
        data,
        method,
        url: `${serverURL}${baseUrl}${endpoint}`,
    })
    .then((response) => response.data)
}

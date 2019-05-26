import ajax from 'axios'

export default (baseUrl: string) => (endpoint: string, method: string = 'get', data) => ajax({
    data,
    method,
    url: `${baseUrl}/${endpoint}`,
})
.then((response) => response.data)

import axios from '../node_modules/axios/index'

const http = new axios.create({
    baseURL: 'https://ownclipboard.com/api'
})

http.interceptors.response.use(res => {
    return res.data.data;
})

export default http;
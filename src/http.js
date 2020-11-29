import axios from 'axios'

const http = new axios.create({
    baseURL: 'https://ownclipboard.com/api'
})

http.interceptors.response.use(res => {
    return res.data.data;
})

export default http;
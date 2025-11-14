import axios from "axios";

const api = axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}:4000/`,
    withCredentials: true
})

export default api

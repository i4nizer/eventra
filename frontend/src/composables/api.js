import axios from "axios";
import * as cookie from "cookie"

//

let api = axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}:4000`,
    withCredentials: false,
})

let token = ""

//

export const useApi = (prefix = `${window.location.protocol}//${window.location.hostname}/api`) => {

    token = cookie.parse(document.cookie)?.token || ""
    api = axios.create({ baseURL: prefix, withCredentials: false, headers: { Authorization: `Bearer ${token}` } })

    const signUp = async (name, email, password) => {
        return await api.post("/auth/sign-up", { name, email, password })
    }

    const signIn = async (email, password) => {
        const res = await api.post("/auth/sign-in", { email, password })
        api = axios.create({ baseURL: prefix, withCredentials: false, headers: { Authorization: `Bearer ${res.data.token}` } })
        token = res.data.token
        document.cookie = cookie.serialize("token", token)
        return res
    }

    const signOut = async () => {
        const res = await api.post("/auth/sign-out")
        api = axios.create({ baseURL: prefix, withCredentials: false })
        token = ""
        document.cookie = ""
        return res
    }

    return { api, token, signUp, signIn, signOut }
}

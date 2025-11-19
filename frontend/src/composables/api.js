import axios from "axios";

//

let api = axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}:4000`,
    withCredentials: false,
})

//

export const useApi = (prefix = `${window.location.protocol}//${window.location.hostname}:4000`) => {

    const signUp = async (name, email, password) => {
        return await api.post("/auth/sign-up", { name, email, password })
    }

    const signIn = async (email, password) => {
        const res = await api.post("/auth/sign-in", { email, password })
        const { token } = res.data
        api = axios.create({ baseURL: prefix, withCredentials: false, headers: { Authorization: `Bearer ${token}` } })
        return res
    }

    const signOut = async () => {
        const res = await api.post("/auth/sign-out")
        api = axios.create({ baseURL: prefix, withCredentials: false })
        return res
    }

    return { api, signUp, signIn, signOut }
}

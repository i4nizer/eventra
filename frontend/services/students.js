import axios from "axios";

const API = "http://localhost:3000/students"; // your backend URL

export default {
  getAll() {
    return axios.get(API);
  },

  create(data) {
    return axios.post(API, data);
  },

  getById(stuid) {
    return axios.get(`${API}/${stuid}`);
  },

  update(stuid, data) {
    return axios.patch(`${API}/${stuid}`, data);
  },

  remove(stuid) {
    return axios.delete(`${API}/${stuid}`);
  },

  getBalance(stuid) {
    return axios.get(`${API}/${stuid}/balance`);
  },
};

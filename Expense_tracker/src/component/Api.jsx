// src/api.js
import axios from "axios";

const API_URL = "http://localhost:1120"; // Replace with your actual endpoint

export const fetchEntries = () => axios.get(API_URL);
export const addEntry = (payload) => axios.post(API_URL, payload);
export const updateEntry = (id, payload) => axios.put(`${API_URL}/${id}`, payload);
export const deleteEntry = (id) => axios.delete(`${API_URL}/${id}`);
export const resetAllEntries = (data) =>
  Promise.all(data.map((item) => deleteEntry(item.id)));

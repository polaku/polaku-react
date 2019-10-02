import axios from 'axios';

const BaseURL = 'http://localhost:3002';

const API = axios.create({
  baseURL: BaseURL
})

export {
  API, BaseURL
}
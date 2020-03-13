import axios from 'axios';

// const BaseURL = 'http://localhost:3000';
// const BaseURL = 'http://192.168.210.117:3000'; //localhost
const BaseURL = 'http://165.22.110.159';

const API = axios.create({
  baseURL: BaseURL
})

export {
  API, BaseURL
}
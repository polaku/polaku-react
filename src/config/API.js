import axios from 'axios';
import { browserName, osName, isMobile } from 'react-device-detect';

const BaseURL = 'http://localhost:4000';
// const BaseURL = 'http://165.22.110.159'; //server digitalocean
// const BaseURL = 'http://api.polagroup.co.id';


const API = axios.create({
  baseURL: BaseURL,
  headers: {
    browser: browserName,
    os: osName,
    isMobile,
    // 'Access-Control-Allow-Origin': '*'
  },
  timeout: 30000
})

export {
  API, BaseURL
}
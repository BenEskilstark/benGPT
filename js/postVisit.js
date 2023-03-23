
import axios from 'axios';
// const axios = require('axios');

// droplet
const axiosInstance = axios.create({
  baseURL: 'https://benhub.io/analytics',
});


const postVisit = (path = '/index', map = 'GET') => {
  const isUnique = !!!localStorage.getItem('isRevisit');
  localStorage.setItem('isRevisit', true);
  return axiosInstance
    .post('/visit', {
      hostname: 'benGPT', path, isUnique, map,
    })
};


const getHostname = () => {
  return window.location.hostname;
}

export default postVisit;

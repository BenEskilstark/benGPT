import axios from 'axios';
// const axios = require('axios');

// droplet
const axiosInstance = axios.create({
  baseURL: 'https://benhub.io/analytics',
});


const postVisit = (path = '/index', map = 'GET') => {
  const hostname = getHostname();
  const isUnique = !!!localStorage.getItem('isRevisit_' + hostname);
  localStorage.setItem('isRevisit_' + hostname, true);
  return axiosInstance
    .post('/visit', {
      hostname, path, isUnique, map,
    })
};


const getHostname = () => {
  // return window.location.hostname;
  return 'benGPT';
}

export default postVisit;


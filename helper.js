const axios = require('axios');

function success(msg, data) {
    return {
        status: 'success',
        message: msg,
        data: data
    }
}

function failed(msg, data) {
    return {
        status: 'failed',
        message: msg,
        data: data
    }
}

async function getCall(url){
    console.log("Hit");
    return await axios.request({
        method: 'GET',
        url: process.env.TRON_API_DOMAIN+url,
        headers: {
          'Content-Type': 'application/json',
          'TRON-PRO-API-KEY': '32d03879-daa5-462f-8f1d-76d740422230'
        }
      })
}

async function postCall(url, header = {}, payload){
    return await axios.request({
        method: 'POST',
        url: process.env.TRON_API_DOMAIN+url,
        headers: {
          'Content-Type': 'application/json',
          'TRON-PRO-API-KEY': '32d03879-daa5-462f-8f1d-76d740422230',
          ...header
        },
        data: payload
      })
}

module.exports = {success, failed, getCall, postCall}
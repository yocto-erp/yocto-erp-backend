const rp = require('request-promise');

function handleSuccess (response) {
  return response;
}

function handleError (error) {
  throw new Error(error);
}

export const get = (url, options = {}) => {
  const requestOptions = {
    ...options,
    method: 'GET',
    uri: `${url}`
  };
  return rp(Object.assign(requestOptions, options));
};

export const post = (url, data, options = {}) => {
  const requestOptions = {
    method: 'POST',
    uri: `${url}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: data,
    ...options
  };
  return rp(requestOptions);
};

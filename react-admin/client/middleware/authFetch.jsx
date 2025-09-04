
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    alert('Your session has expired. Please log in again.');
    localStorage.removeItem('token');

    setTimeout(() => {
      window.location.href = '/';
    }, 1000);  

    return null;
  }


  return response;
};

export const callAPI = async (url, method = 'GET', query, type='json', body, extraHeaders)=>{
  if (query) {
    url += '?' + new URLSearchParams(query).toString();;
  }
  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    ...extraHeaders
  }
  try {
    const response = await fetch(`http://localhost:3000${url}`, {
      headers: type ==='json'? headers : undefined,
      method: method,
      body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
      throw new Error('Request categories failed');
    }
    const result = await response.json();
    return result
  } catch (error) {
    throw new Error(error);
  }
}
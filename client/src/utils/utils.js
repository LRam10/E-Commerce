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
    const response = await fetch(`${url}`, {
      headers: type ==='json'? headers : undefined,
      method: method,
      body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
      const resultError = await response.json();
      let error = new Error()
      error.data = resultError.errors
      throw error;
    }
    const result = await response.json();
    return result
  } catch (error) {
    let returnError = new Error();
    returnError.data = error.data
    throw returnError;
  }
}
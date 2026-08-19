export const callAPI = async (url, method = 'GET', query, type='json', body, extraHeaders)=>{
  if (query) {
    url += '?' + new URLSearchParams(query).toString();;
  }
  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    ...extraHeaders
  }
  const response = await fetch(`${url}`,{
    headers: type ==='json'? headers : undefined,
    method: method,
    credentials:'include',
    body: body ? JSON.stringify(body) : null,
  });
  if (!response.ok) {
    //Body may be empty or non-JSON, don't let that mask the real status
    const resultError = await response.json().catch(()=> ({}));
    const error = new Error(resultError.msg || `Request failed with ${response.status}`);
    error.status = response.status;
    error.data = resultError.errors;
    throw error;
  }
  //204 or an empty/non-JSON body is still a success, don't turn it into a parse error
  if(response.status === 204) return null;
  return response.json().catch(()=> null);
}

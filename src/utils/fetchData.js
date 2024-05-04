export const getDataAPI = async (url, token) =>{
    const response = await fetch(`https://localhost:5001/api${url}`,{
        headers: {
            Authorization: token
        }
    })
}
export const postDataAPI = async (url, data, token) =>{
    console.log(data)
    const response = await fetch(`https://localhost:5001/api${url}`, {
        method: 'POST',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json;
}
export const putDataAPI = async (url, data, token) =>{
    const response = await fetch(`https://localhost:5001/api${url}`, {
        method: 'PUT',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json;
}
export const deleteDataAPI = async (url, token) =>{
    const response = await fetch(`https://localhost:5001/api${url}`, {
        method: 'DELETE',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json; charset=utf-8',
        }
    })
    const json = await response.json();
    return json;
}
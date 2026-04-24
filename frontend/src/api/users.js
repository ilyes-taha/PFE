const API="http://127.0.0.1:8000/users";

export async function getUsers(){

const res=await fetch(API);

return await res.json();

}
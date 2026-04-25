const API="/users";

export async function getUsers(){

const res=await fetch(API);

return await res.json();

}
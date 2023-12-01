//get categories
   export const getCategories = async ()=>{
    let headers= {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
        try {
            const response = await fetch('http://localhost:5000/categories',{
                headers,
                method: 'GET',
            });
            if(!response.ok){
                throw new Error('Request categories failed');
            }
            return response.json();
        } catch (error) {
            throw new Error(error);
        }
    };

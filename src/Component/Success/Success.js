

const getUserDataGoogle = async (accessToken) => {
    const response = await fetch(`http://localhost:5001/api/google/login?accessToken=${accessToken}`);
    const json = await response.json();
    return json;
}

const Success = () => {



    return (
        <div>
            
        </div>
    );
};

export default Success;
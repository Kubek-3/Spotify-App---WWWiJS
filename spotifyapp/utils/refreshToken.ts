import axios from "axios";

export const refreshToken = async (user_id: string) => {
    const response = await axios.get(
        `/api/refresh?user_id=${user_id}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    console.log(response.data);
    localStorage.setItem(
        "access_token",
        response.data.accessToken
    );

}
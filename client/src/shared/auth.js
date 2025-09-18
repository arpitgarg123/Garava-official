let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (t) => {
  accessToken = t;
};

export async function refreshToken(){
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}`, {
            credentials: "include",
        })
        if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken;
        
    } catch (error) {
        console.log("refresh token error", error);
        return null
        
    }
}
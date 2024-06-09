export const envHelper = {
    isDevMode: process.env.NODE_ENV === 'development',
    apiLink: process.env.REACT_APP_API_LINK || 'http://localhost:8081',
};
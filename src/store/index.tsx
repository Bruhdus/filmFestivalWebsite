import create from 'zustand';

interface UserInfo {
    token: string;
    setToken: (token: string) => void;
    removeToken: () => void;
    userId: string;
    setUserId: (userId: string) => void;
    removeUserId: () => void;
}

const getLocalStorage = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: string) => window.localStorage.setItem(key, JSON.stringify(value));

const userInfoStorage = create<UserInfo>((set) => ({
    token: getLocalStorage('token') || '',
    setToken: (newToken: string) => set(() => {
        setLocalStorage('token', newToken)
        return {token: newToken}
    }),
    removeToken: () => set(() => {
        setLocalStorage('token', '')
        return {token: ''}
    }),
    userId: getLocalStorage('userId') || '',
    setUserId: (newUserId: string) => set(() => {
        setLocalStorage('userId', newUserId)
        return {userId: newUserId}
    }),
    removeUserId: () => set(() => {
        setLocalStorage('userId', '')
        return {userId: ''}
    })
}))

export const useUserInfoStorage = userInfoStorage;
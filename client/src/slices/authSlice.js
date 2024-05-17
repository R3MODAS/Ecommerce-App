import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        mode: "light",
        user: null,
        token: null,
        posts: []
    },
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light"
        },
        setLogin: (state, action) => { },
        setLogout: (state) => { },
        setFriends: (state, action) => { },
        setPosts: (state, action) => { },
        setPost: (state, action) => { }
    }
})

export const { setMode, setLogin, setFriends, setLogout, setPost, setPosts } = authSlice.actions
export default authSlice.reducer
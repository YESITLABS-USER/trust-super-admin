"use client"
import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./slices/adminSlice.js";

const store = configureStore({
    reducer: {
        admin : adminSlice,
    },
    devTools: true
})

export default store;
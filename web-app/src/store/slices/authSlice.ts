import { Customer } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Role = "guest" | "admin";

export interface InitialStateType {
    role: Role
    user?: Customer
}

const initialState: InitialStateType = {
    role: "guest",
    user: undefined
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setRole: (state, action: PayloadAction<Role>) => {
            state.role = action.payload;
        },
        setUser: (state, action: PayloadAction<Customer | undefined>) => {
            state.user = action.payload;
        },
        reset: () => initialState
    }
})

export const { setRole, setUser, reset } = authSlice.actions
export default authSlice.reducer
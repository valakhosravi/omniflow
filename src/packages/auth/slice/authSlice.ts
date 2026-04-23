import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SigninResponse } from '../types';
import { UserDetail } from '../types/UserDetail';

interface AuthState {
  user: SigninResponse | null;
  userDetail: UserDetail | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  userDetail: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SigninResponse>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setUserDetail: (state, action: PayloadAction<UserDetail>) => {
      state.userDetail = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.userDetail = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setUserDetail, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;

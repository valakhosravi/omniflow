import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useSigninMutation,
  useSigninTestMutation,
  useLogoutMutation,
  useGetUserQuery,
} from "../api/authApi";
import {
  setUser,
  setUserDetail,
  logout as logoutAction,
} from "../slice/authSlice";
import { RootState } from "@/store/store";
import { SigninRequest } from "../types";
import { useRouter } from "next/navigation";
import useTransactionStore from "@/store/Transaction";
import { useBasketStore } from "@/store/basketStore";
import { useReservationStore } from "@/store/reservationStore";
import { useFavoriteStore } from "@/store/BookmarkStore";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [isClient, setIsClient] = useState(false);

  // Fail-safe behavior: use /login unless env explicitly declares production.
  const isProductionEnv =
    process.env.NEXT_PUBLIC_NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_APP_ENV === "production";
  const isTestEnv = !isProductionEnv;
  const [signinRegular, { isLoading: isSigningInRegular }] =
    useSigninMutation();
  const [signinTest, { isLoading: isSigningInTest }] = useSigninTestMutation();

  const signin = isTestEnv ? signinTest : signinRegular;
  const isSigningIn = isTestEnv ? isSigningInTest : isSigningInRegular;

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: userDetailData, isLoading: isLoadingUser } = useGetUserQuery(
    undefined,
    {
      skip: !auth.isAuthenticated || !isClient,
    }
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const login = useCallback(
    async (credentials: SigninRequest) => {
      try {
        const response = await signin(credentials).unwrap();
        if (response.ResponseCode === 100 && response.Data) {
          dispatch(setUser(response.Data));
          return response;
        }
        throw new Error(response.ResponseMessage || "Login failed");
      } catch (error) {
        throw error;
      }
    },
    [signin, dispatch]
  );

  const logout = useCallback(
    async (onSuccessCallback?: () => void) => {
      try {
        // Clear Redux state first to prevent any queries from running
        dispatch(logoutAction());

        await logoutApi().unwrap();
      } catch (error) {
        console.log("Logout error:", error);
      } finally {
        // Clear all persisted data
        localStorage.clear();
        document.cookie =
          "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        // Reset all Zustand stores
        useTransactionStore.getState().resetState();
        useBasketStore.getState().clearItems();
        useReservationStore.getState().setHasAttemptedNext(false);
        useReservationStore.getState().setHasClickedNextDay(false);
        useReservationStore.getState().setDisableEdit(false);
        useReservationStore.getState().setIsHolidayPlan(false);
        useFavoriteStore.getState().setFavorites([]);
        useFavoriteStore.getState().setCount(0);

        // Navigate to home page
        router.push("/");

        if (onSuccessCallback) onSuccessCallback();
      }
    },
    [logoutApi, dispatch, router]
  );

  // Update user detail when data is fetched
  useEffect(() => {
    if (userDetailData?.ResponseCode === 100 && userDetailData.Data) {
      dispatch(setUserDetail(userDetailData.Data));
    }
  }, [userDetailData, dispatch]);

  return {
    user: auth.user,
    userDetail: auth.userDetail,
    isAuthenticated: auth.isAuthenticated,
    isLoading:
      !isClient ||
      auth.isLoading ||
      isSigningIn ||
      isLoggingOut ||
      isLoadingUser,
    login,
    logout,
  };
};

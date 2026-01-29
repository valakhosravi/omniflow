import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { addToaster } from "@/ui/Toaster";
import { SigninRequest } from "@/packages/auth/types";

export function useSignin() {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  const { isPending: isLoginLoading, mutate: loginUser } = useMutation({
    mutationFn: (credentials: SigninRequest) => login(credentials),
    onSuccess: async (data) => {
      if (data.ResponseCode === 100) {
        const firstname = data.Data?.FullName;
        document.cookie = "isLoggedIn=true; path=/";
        
        addToaster({
          title: ` ${firstname} عزیز خوش آمدید`,
          color: "success",
        });
        
        queryClient.invalidateQueries({ queryKey: ["favoriteList"] });
        queryClient.invalidateQueries({ queryKey: ["reservation"] });
        queryClient.invalidateQueries({
          queryKey: ["GetBalanceAndCharge"],
        });
      } else {
        addToaster({
          title: data.ResponseMessage,
          color: "danger",
        });
      }
    },
    onError: (error) => {
      addToaster({
        title: error.message,
        color: "danger",
      });
    },
  });
  return { isLoginLoading, loginUser };
}

export function useGetUserDetail() {
  const { userDetail, isLoading: isGetting } = useAuth();
  
  return { 
    userDetail, 
    isGetting, 
    error: null // Error handling is managed by Redux
  };
}

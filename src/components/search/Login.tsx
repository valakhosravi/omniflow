import { SigninFormValues } from "@/models/auth/SigninFormValues";
import { SigninRequest } from "@/models/auth/SignRequest";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import useAuthValidation from "@/validations/AuthValidation";
import Image from "next/image";
import RHFInput from "../../ui/RHFInput";
import CustomButton from "@/ui/Button";

import { useRef, useState } from "react";

import { Icon } from "@/ui/Icon";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { addToaster } from "@/ui/Toaster";

export default function Login({
  isOpen,
  onOpenChange,
  onClose,
  redirectPath,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  redirectPath?: string | null;
}) {
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const [passwordIcon, setPasswordIcon] = useState<"key" | "eyeOff" | "eye">(
    "key"
  );
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = (values: SigninFormValues) => {
    const loginData: SigninRequest = {
      ...values,
      domain: "test",
    };
    login(loginData)
      .then((data) => {
        if (data?.ResponseCode === 100) {
          onClose();
          reset();
          if (redirectPath) {
            router.push(redirectPath);
          }
        } else {
          addToaster({
            title: data.ResponseMessage,
            color: "danger",
          });
        }
      })
      .catch((error) => {
        addToaster({
          color: "danger",
          title: error.message || "خطا در سرور",
        });
      });
  };

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    getValues,
    formState: { errors },
  } = useAuthValidation();

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
    if (showPassword) {
      setPasswordIcon("eyeOff");
    } else {
      setPasswordIcon("eye");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} autoComplete="on">
        <ModalContent className="!w-[483px] max-w-[483px] max-h-[563px]">
          <ModalHeader className="self-center pt-[20px] px-[24px]">
            <Image src="/icons/PECCO.svg" alt="pecco" width={147} height={49} />
          </ModalHeader>
          <ModalBody className="px-[24px] pt-[24px] pb-[24px]">
            <div className="flex flex-col items-start justify-center space-y-[8px]">
              <h4 className="font-bold text-secondary-950 text-[16px]/[24px]">
                ورود به حساب کاربری
              </h4>
              <p className="text-secondary-400 font-medium text-[12px]/[18px]">
                لطفا مشخصات حساب خود را وارد کنید.
              </p>
            </div>
            <div className="text-secondary-950 w-[435px]">
              <RHFInput
                label="نام کاربری"
                icon="/icons/user.svg"
                required
                type="text"
                autoComplete="username"
                register={register("username")}
                error={errors.username?.message}
                inputDirection="ltr"
                data-cy="username-input"
                customEvent={{
                  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      formRef.current?.requestSubmit();
                    }
                  },
                }}
                endContent={
                  <Image
                    src="/icons/user.svg"
                    alt="user-icon"
                    width={20}
                    height={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  />
                }
              />
            </div>
            <div className="text-secondary-950 w-[435px]">
              <RHFInput
                label="رمز عبور"
                required
                type={showPassword ? "text" : "password"}
                register={register("password")}
                error={errors.password?.message}
                inputDirection="ltr"
                autoComplete="current-password"
                data-cy="password-input"
                customEvent={{
                  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      formRef.current?.requestSubmit();
                    }

                    if (getValues("password").length > 0) {
                      if (showPassword) setPasswordIcon("eye");
                      else setPasswordIcon("eyeOff");
                    } else {
                      setShowPassword(false);
                      setPasswordIcon("key");
                    }
                  },
                  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (
                      e.key === "Backspace" &&
                      getValues("password").length == 0
                    ) {
                      setShowPassword(false);
                      setPasswordIcon("key");
                    }
                  },
                  onValueChange: (value: string) => {
                    if (value.length > 0 && !showPassword) {
                      setPasswordIcon("eyeOff");
                    }
                  },
                }}
                endContent={
                  <Icon
                    onClick={toggleVisibility}
                    name={passwordIcon}
                    className="text-secondary-400 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  />
                }
              />
            </div>
          </ModalBody>
          <ModalFooter className="pb-[20px] px-[24px]">
            <CustomButton
              isLoading={isLoading}
              type="submit"
              className="flex items-center justify-center w-[435px] h-[56px]
               bg-primary-950 rounded-[12px] text-secondary-0 gap-x-[8px] cursor-pointer"
              data-cy="login-button-submit"
            >
              <span>ورود به حساب کاربری</span>
              <span>
                <Image
                  alt="arrow-left"
                  src="/icons/arrow-left.svg"
                  width={24}
                  height={24}
                />
              </span>
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

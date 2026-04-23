
"use client";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import Image from "next/image";
import { isBirthdayToday } from "@/utils/isBirthdayToday";
import { isYaldaTodayOrTomorrow } from "@/utils/isYaldaTodayOrTomorrow";
import HomePageFavServices from "@/features/homePage/components/HomePageFavServices/HomePageFavServices";
import HomePageFooter from "@/features/homePage/components/Footer/HomePageFooter";
import HomePageSearch from "@/features/homePage/components/HomePageSearch";

const HomePageComponent = () => {
  const { userDetail } = useAuth();

  // Check if today is Yalda (prioritized)
  const isYalda = isYaldaTodayOrTomorrow();
  // Check if today is user's birthday
  const isBirthday = userDetail?.UserDetail?.BirthDate
    ? isBirthdayToday(userDetail.UserDetail.BirthDate)
    : false;
  // const isBirthday = true;

  // Determine which image to show: Yalda > Birthday > Default
  const getImageSrc = () => {
    // if (isYalda) return "/icons/TIKA-yalda.png";
    // if (isBirthday) return "/icons/TIKA-birthday.png";
    return "/icons/tika-logo.svg";
  };

  const getImageAlt = () => {
    // if (isYalda) return "TIKA yalda";
    // if (isBirthday) return "TIKA birthday";
    return "TIKA";
  };

  const getImageDimensions = () => {
    if (isYalda) return { width: 340, height: 180 }; // Using similar dimensions to birthday image
    if (isBirthday) return { width: 340, height: 180 };
    return { width: 294, height: 98 };
  };

  const imageDimensions = getImageDimensions();

  return (

    <div className="flex h-full flex-col  relative justify-between">
      <Image
        src="/pictures/bg.webp"
        fill
        objectFit="fill"
        alt="Dashboard Background"
      />
      <div className="w-full  h-full flex flex-col  absolute ">

        <div className="z-10 w-full flex-1 flex flex-col justify-center items-center bg-transparent">
          <div className="space-y-10 w-[586px] min-h-fit">
            <Image
              className="mx-auto "
              src={getImageSrc()}
              alt={getImageAlt()}
              width={imageDimensions.width}
              height={imageDimensions.height}
            />
            <HomePageSearch userDetail={userDetail} />
            <HomePageFavServices />
          </div>
        </div>

        <HomePageFooter />
        {/* <div className="self-end mx-12 my-4"><HomePageFooter /></div> */}
      </div></div>
  );
};

export default HomePageComponent;

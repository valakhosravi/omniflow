import { CardCoin, Money, Monitor, Profile2User } from "iconsax-reactjs";

export const UNIT_ITEM_HEIGHT = 54;

export const filters = [
  { id: 1, title: "همه", count: 1, total: 4 },
  { id: 2, title: "در انتظار اقدام", count: 2, total: 4 },
  { id: 3, title: "تایید شده", count: 3, total: 4 },
  { id: 4, title: "رد شده", count: 4, total: 4 },
];

export const strap = [
  { id: 1, title: "بند 1", colorCode: 1 },
  { id: 2, title: "بند 2", colorCode: 2 },
  { id: 3, title: "بند 3", colorCode: 3 },
];

export const colorMap = [
  { id: 1, className: "text-trash bg-accent-400" },
  { id: 2, className: "text-accent-100 bg-accent-S-C" },
  { id: 3, className: "text-primary-950/[.6] bg-primary-950/[.1]" },
];

export const units = [
  {
    id: 1,
    title: "منابع انسانی",
    icon: <Profile2User size={16} />,
    straps: strap,
  },
  {
    id: 2,
    title: "تیم فنی و IT",
    icon: <Monitor size={16} />,
    straps: strap,
  },
  {
    id: 3,
    title: "مالی",
    icon: <Money size={16} />,
    straps: strap,
  },
  {
    id: 4,
    title: "حسابداری",
    icon: <CardCoin size={16} />,
    straps: strap,
  },
  {
    id: 5,
    title: "مدیریت",
    icon: <CardCoin size={16} />,
    straps: strap,
  },
];

export const STATUS_STYLES: Record<number, string> = {
  100: "bg-[#8D9CB11A] text-[#307FE2]",
  111: "bg-accent-300 text-accent-200",
  112: "bg-blue-100 text-blue-400",
  102: "bg-[#4CAF50] text-[#EAF7EC]",
  108: "bg-[#4CAF50] text-[#EAF7EC]",
  103: "bg-[#FFEBEE] text-[#FF1751]",
  104: "bg-gray-200 text-gray-400",
};

import { BugFixComponentType } from "@/packages/features/bug-fix/BugFix.types";
import BugFixPageComponent from "@/packages/features/bug-fix/pages/BugFixPageComponent";

export const metadata = {
  title: "PECCO | رفع باگ",
  description: "",
};

export default function BugFixPage() {
  return <BugFixPageComponent type={BugFixComponentType.CREATE} />;
}

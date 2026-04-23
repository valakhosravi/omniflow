import { BugFixComponentType } from "@/features/support/bug/v1/Bug.types";
import BugStartPageComponent from "@/features/support/bug/v1/components/Start/BugStartPageComponent";

export const metadata = {
  title: "TIKA | رفع باگ",
  description: "",
};

export default function BugFixPage() {
  return <BugStartPageComponent type={BugFixComponentType.CREATE} />;
}

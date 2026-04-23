import { DevelopmentPagesEnum } from "../../development.types";
import DevelopmentCreateIndex from "./DevelopmentCreateIndex";

export default function DevelopmentStartPageComponent() {
  return <DevelopmentCreateIndex pageType={DevelopmentPagesEnum.START} />;
}

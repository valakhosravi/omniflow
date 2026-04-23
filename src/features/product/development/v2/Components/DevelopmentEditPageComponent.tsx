"use client";

import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { DevelopmentPagesEnum } from "../development.types";
import DevelopmentCreateIndex from "./Start/DevelopmentCreateIndex";

function DevelopmentEditPageComponent() {
  return <DevelopmentCreateIndex pageType={DevelopmentPagesEnum.EDIT} />;
}

export default AppWithTaskInboxSidebar(DevelopmentEditPageComponent);

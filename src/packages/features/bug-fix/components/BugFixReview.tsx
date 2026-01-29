"use client";
import { BugFixPagesTypes, UserReviewEnum } from "../BugFix.types";
import BugFixIndex from "./BugFixIndex";

function BugFixUserReview({ requestId }: { requestId: string }) {
  return (
    <BugFixIndex<UserReviewEnum>
      pageType={BugFixPagesTypes.USER_REVIEW}
      requestId={requestId}
      hasAcceptRequestButton={false}
    />
  );
}

export default BugFixUserReview;

import Articles from "./Articles";
import Completion from "./Completion";
import ReadyMadeClauses from "./ReadyMadeClauses";

export default function CompletionOfTermsContract() {
  return (
    <div className="flex items-start justify-center w-full h-full gap-x-4 mb-4">
      <Articles />
      <Completion />
      <ReadyMadeClauses />
    </div>
  );
}

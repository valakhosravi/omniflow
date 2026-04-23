import { Term } from "../../contract.types";

export default function LmcSubClauses({ term }: { term: Term }) {
  return (
    <div className="flex flex-col gap-y-4 mt-5">
      {term.SubClauses.map((sub) => {
        return (
          <div
          key={sub.Title}
            className="border border-primary-950/[.1] rounded-[16px] 
      bg-primary-950/[.03] p-3 flex flex-col gap-y-2"
          >
            <div className="font-semibold text-[20px]/[28px] text-primary-950">
              {sub.Title}
            </div>
            <div className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
              {sub.Description}
            </div>
          </div>
        );
      })}
    </div>
  );
}

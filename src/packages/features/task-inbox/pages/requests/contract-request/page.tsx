import TaskInboxLayout from "../../../layouts";
import { FORM_COMPONENTS, FORM_KEYS } from "./constants/forms";

export default function ContractRequestPage() {
  const FormComponent = FORM_COMPONENTS[FORM_KEYS.L_CHECK];
  return (
    <TaskInboxLayout>
      <div className="px-4 py-6">
        <div className="flex items-center mb-4 justify-between">
          <div className="inline-flex items-center gap-2">
            {/* <TagIcon fill="#4A85E7" /> */}
            <span className="text-[#1C3A63] text-[16px] font-[500]">
              درخواست قرارداد
            </span>
          </div>
        </div>
        {FormComponent && <FormComponent />}
      </div>
    </TaskInboxLayout>
  );
}

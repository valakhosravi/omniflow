import { Tab, Tabs } from "@heroui/react";
import LmcTabItem from "./LmcTabItem";
import { GetContractInfo } from "../../contract.types";
import { useGetTermAssigneeWithContractIdAndUserIdQuery } from "../../contract.services";
import { useAuth } from "@/packages/auth/hooks/useAuth";

interface LmcTabsProps {
  contractData: GetContractInfo;
}

export default function LmcTabs({ contractData }: LmcTabsProps) {
  const { userDetail } = useAuth();
  const { data: termAssignee } = useGetTermAssigneeWithContractIdAndUserIdQuery(
    {
      contractId: contractData.ContractId,
      assignerUserId: userDetail?.UserDetail.UserId ?? 0,
    },
    { skip: userDetail?.UserDetail.UserId === 0 },
  );

  return (
    <div className="flex items-center flex-col w-full mx-auto">
      <Tabs
        fullWidth
        className="self-center mt-[32px] mb-[16px]"
        classNames={{
          base: `max-w-[538px]`,
          tabList: `bg-transparent border border-primary-950/[.1] p-[4px]`,
          tab: `leading-none`,
          cursor: `shadow-none group-data-[selected=true]:bg-primary-950/[.05] group-data-[selected=true]:border group-data-[selected=true]:border-primary-950/[.1]`,
          tabContent: `group-data-[selected=true]:text-primary-950 text-primary-950/[.5] font-medium text-[14px]/[23px]`,
          panel: `w-full`,
        }}
      >
        <Tab key="All" title="همه">
          <LmcTabItem contractData={contractData} termAssignee={termAssignee} />
        </Tab>
        <Tab key="Action Required" title="نیازمند اقدام">
          <LmcTabItem contractData={contractData} termAssignee={termAssignee} />
        </Tab>
        <Tab key="Approved" title="تایید شده ها">
          <LmcTabItem contractData={contractData} termAssignee={termAssignee} />
        </Tab>
        <Tab key="Rejected" title="رد شده ها">
          <LmcTabItem contractData={contractData} termAssignee={termAssignee} />
        </Tab>
      </Tabs>
    </div>
  );
}

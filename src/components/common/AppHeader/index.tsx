import { AppHeaderSearch } from "./AppHeaderSearch";

export default function AppHeader() {
  return (
    <div className={`flex justify-between items-center gap-x-[50px]`}>
      <div className="flex items-center gap-x-[40px]">
        {/* <AuthSection />
        <CoServicesDropDown />
        <TaskboxLink /> */}
      </div>
      <AppHeaderSearch />
    </div>
  );
}

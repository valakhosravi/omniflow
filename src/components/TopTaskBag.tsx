"use client";
import { useRouter } from "next/navigation";
import { Badge, Button } from "@/ui/NextUi";
import { MdInbox } from "react-icons/md";
import { VscSend } from "react-icons/vsc";

export default function TopTaskBag() {
  const router = useRouter();
  const inboxCount = 5;
  return (
    <>
      <div className="flex justify-center items-center   w-full">
        <Button
          radius="none"
          variant="bordered"
          className="flex-1"
          startContent={<VscSend size={26} />}
          onPress={() => {
            router.push("/requests");
          }}
        >
          درخواست ها
        </Button>
        <Badge
          placement="top-left"
          color="danger"
          content={inboxCount}
          size="md"
        >
          <Button
            radius="none"
            variant="bordered"
            className="flex-1"
            startContent={<MdInbox size={26} />}
            onPress={() => {
              router.push("/tasks");
            }}
          >
            وظایف
          </Button>
        </Badge>
      </div>
    </>
  );
}

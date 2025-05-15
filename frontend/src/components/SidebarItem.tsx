import { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
}

export default function SidebarItem(props: SidebarItemProps) {
  return (
    <div className="flex flex-col rounded-md px-4 py-2 my-1 hover:bg-gray-100 focus:bg-gray-200 cursor-pointer">
      <div className="flex  items-center">
        <div className="mr-6 w-5 text-gray-600">{props.icon}</div>
        <div className="text-gray-500 font-medium">{props.text}</div>
      </div>
    </div>
  );
}

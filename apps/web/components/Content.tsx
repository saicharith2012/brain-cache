import PlusIcon from "@repo/ui/icons/PlusIcon";
import { ContentWithTags } from "../types/global";
import Card from "./Card";

export default function Content({ data }: { data: ContentWithTags[] }) {
  return (
    <div className="p-8 flex">
      <div className="w-72 h-72 p-6 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300 border-2 border-black border-dashed rounded-lg cursor-pointer">
        <div className="opacity-80 my-3">
          <PlusIcon size="6xl"/>
        </div>
        <div className="text-3xl mt-6 text-start">Add a new memory to your<br/> brain&apos;s cache</div>
      </div>
      {data.map((item) => (
        <div key={item.id} className="mx-4">
          <Card
            title={item.title}
            link={item.link}
            type={item.type}
            tags={item.contentTags}
          />
        </div>
      ))}
    </div>
  );
}

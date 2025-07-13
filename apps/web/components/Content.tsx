import { ContentWithTags } from "../types/global";
import Card from "./Card";

export default function Content({ data }: { data: ContentWithTags[] }) {
  return (
    <div className="p-8 flex">
      {data.map((item) => (
        <div key={item.id}>
          <Card title={item.title} link={item.link} type={item.type} tags={item.contentTags}/>
        </div>
      ))}
    </div>
  );
}

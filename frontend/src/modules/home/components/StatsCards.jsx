import {
  MessageSquare,
  FileText,
  Star,
  HardDrive,
} from "lucide-react";


export default function StatsCards({
  chats = [],
  documents = [],
}) {

  const stats = [
    {
      title: "Chats",
      value: chats.length,
      icon: MessageSquare,
    },
    {
      title: "Documents",
      value: documents.length,
      icon: FileText,
    },
    {
      title: "Favorites",
      value: 0,
      icon: Star,
    },
    {
      title: "Storage",
      value: "0 MB",
      icon: HardDrive,
    },
  ];


  return (

    <div className="mt-10">

      <h2 className="mb-5 text-2xl font-bold text-white">
        Overview
      </h2>


      <div
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {stats.map((item) => {

          const Icon =
            item.icon;


          return (

            <div
              key={item.title}
              className="
                rounded-2xl
                border
                border-[#20283A]
                bg-[#151B2F]
                p-6
                shadow-md
                transition-all
                duration-300
                hover:border-indigo-500/30
                hover:shadow-xl
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-600
                  text-white
                "
              >
                <Icon size={26} />
              </div>


              <h3 className="mt-5 text-gray-400">
                {item.title}
              </h3>


              <p className="mt-2 text-3xl font-bold text-white">
                {item.value}
              </p>

            </div>

          );

        })}

      </div>

    </div>

  );

}
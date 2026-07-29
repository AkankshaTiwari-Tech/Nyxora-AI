import {
  FileText,
  FileSpreadsheet,
  ClipboardList,
  Presentation,
} from "lucide-react";

const files = [
  {
    title: "AI Notes - Machine Learning",
    type: "Notes",
    time: "2 hours ago",
    icon: <FileText size={22} />,
  },
  {
    title: "Class 8 Maths Test",
    type: "Test",
    time: "Yesterday",
    icon: <ClipboardList size={22} />,
  },
  {
    title: "Physics Presentation",
    type: "Presentation",
    time: "2 days ago",
    icon: <Presentation size={22} />,
  },
  {
    title: "Student Attendance",
    type: "Spreadsheet",
    time: "Last Week",
    icon: <FileSpreadsheet size={22} />,
  },
];

export default function RecentFiles() {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-white">
          Recent Files
        </h2>

        <button className="text-indigo-400 hover:text-indigo-300 transition">
          View All
        </button>
      </div>

      <div className="bg-[#151B2F] rounded-2xl overflow-hidden">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-6 py-5 border-b border-[#232B45] last:border-none hover:bg-[#1B2340] transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                {file.icon}
              </div>

              <div>
                <h3 className="text-white font-semibold">
                  {file.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {file.type}
                </p>
              </div>
            </div>

            <span className="text-gray-500 text-sm">
              {file.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
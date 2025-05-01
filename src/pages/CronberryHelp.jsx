import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  MessageSquare,
  Settings,
  FileText,
  Phone,
  Mail,
  LineChart,
  Zap,
  Play,
} from "lucide-react";

const FallbackImage = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    onError={(e) => (e.currentTarget.style.display = "none")}
    className="rounded-lg border shadow-md w-full max-h-[400px] object-contain"
  />
);

const iconMap = {
  "Get Started": <Play size={18} className="inline mr-2 text-blue-600" />,
  "Lead Management": (
    <BookOpen size={18} className="inline mr-2 text-blue-600" />
  ),
  "Reports and Analytics": (
    <LineChart size={18} className="inline mr-2 text-blue-600" />
  ),
  "Marketing Automation": (
    <Zap size={18} className="inline mr-2 text-blue-600" />
  ),
  Integrations: <Mail size={18} className="inline mr-2 text-blue-600" />,
  Configuration: <Settings size={18} className="inline mr-2 text-blue-600" />,
  "Invoice & Quotation": (
    <FileText size={18} className="inline mr-2 text-blue-600" />
  ),
  IVR: <Phone size={18} className="inline mr-2 text-blue-600" />,
  WABA: <MessageSquare size={18} className="inline mr-2 text-blue-600" />,
};

const CronberryHelp = () => {
  const [helpTopics, setHelpTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [search, setSearch] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetchHelpTopicsData();
  }, []);

  const fetchHelpTopicsData = async () => {
    fetch(
      "https://opensheet.elk.sh/1eoEtPzIkFh7BqNQOreGzg7bKdRPJhxk0CNpE9vtUNFU/HelpTopics"
    )
      .then((res) => res.json())
      .then((data) => {
        const grouped = data.reduce((acc, item) => {
          const category = item["Category"];
          if (!category || !iconMap[category]) return acc;
          if (!acc[category]) acc[category] = [];
          acc[category].push({
            title: item["Title"],
            content: item["Content"],
            image: item["Image URL"],
            video: item["Video URL"],
          });
          return acc;
        }, {});

        const formatted = Object.entries(iconMap).map(([category]) => ({
          category,
          topics: grouped[category] || [],
        }));

        setHelpTopics(formatted);

        // Auto-select the first available topic
        const firstTopic =
          formatted.find((g) => g.topics.length)?.topics[0] || "";
        setSelectedTopic(firstTopic);
      });
  };

  const filteredTopics = helpTopics.map((group) => ({
    ...group,
    topics: group.topics.filter((t) =>
      t.title?.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full bg-white border-r px-6 py-6 shadow-md overflow-y-auto text-[15px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 tracking-wide">
          Help Center
        </h2>
        <Input
          placeholder="Search help..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-5 rounded-md"
        />
        <ScrollArea className="h-[calc(100vh-160px)] pr-1">
          {filteredTopics.map((group, i) => (
            <div key={i} className="mb-5">
              <button
                className="w-full flex items-center gap-2 text-left font-medium text-gray-700 hover:text-blue-700 transition-colors text-base py-1.5 cursor-pointer"
                onClick={() =>
                  setExpandedCategory(expandedCategory === i ? null : i)
                }
              >
                {iconMap[group.category]} {group.category}
              </button>
              <AnimatePresence initial={false}>
                {expandedCategory === i && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-1 pl-6 space-y-1 overflow-hidden"
                  >
                    {group.topics.length > 0 ? (
                      group.topics.map((topic, j) => (
                        <li
                          key={j}
                          onClick={() => setSelectedTopic(topic)}
                          className={`cursor-pointer py-1 px-2 rounded-md text-sm leading-snug hover:bg-blue-50 hover:text-blue-700 transition ${
                            selectedTopic?.title === topic.title
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {topic.title}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm pl-2">
                        No articles yet
                      </li>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 md:px-10 py-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {selectedTopic ? (
            <div className="bg-white shadow-xl rounded-xl p-8 space-y-6 transition-all duration-300">
              <div className="flex justify-between items-start border-b pb-4">
                <h2 className="text-3xl font-semibold text-blue-800">
                  {selectedTopic.title}
                </h2>
                <button className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">
                  Was this helpful?
                </button>
              </div>

              <div className="prose max-w-none text-gray-800 space-y-4">
                {selectedTopic.content?.split("\n").map((line, i) => (
                  <p key={i} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>

              {selectedTopic.video && (
                <div className="relative overflow-hidden rounded-xl shadow-md">
                  <iframe
                    src={selectedTopic.video}
                    title="Help video"
                    className="w-full h-96"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              )}

              {!selectedTopic.video && selectedTopic.image && (
                <FallbackImage
                  src={selectedTopic.image}
                  alt={selectedTopic.title}
                />
              )}

              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">
                  Was this article helpful?
                </p>
                <div className="flex space-x-3">
                  <button className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 cursor-pointer">
                    Yes
                  </button>
                  <button className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 cursor-pointer">
                    No
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-lg text-center pt-24">
              Select a question from the left to view its details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CronberryHelp;

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
  UserRoundCog,
  CircleEllipsis,
} from "lucide-react";
import toast from "react-hot-toast";

const FallbackImage = ({ src, alt, getPreviewLink }) => {
  return (
    // <img
    //   src={getImageLink(src)}
    //   alt={alt}
    //   // onError={(e) => (e.currentTarget.style.display = "none")}
    //   className="rounded-lg border shadow-md w-full max-h-[400px] object-contain"
    // />
    <iframe
      src={getPreviewLink(src)}
      width="100%"
      height="400"
      allow="autoplay"
    ></iframe>
  );
};
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
  "User Management": (
    <UserRoundCog size={18} className="inline mr-2 text-blue-600" />
  ),
  "Support & Training": (
    <img
      className="support_img"
      src="/support.png"
      alt="support"
      height={20}
      width={20}
    />
  ),
  Others: <CircleEllipsis size={18} className="inline mr-2 text-blue-600" />,
};

const parseBoldText = (content) => {
  const parts = content.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  );
};

const CronberryHelp = () => {
  const [helpTopics, setHelpTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [iconMaps, setIconMaps] = useState(null);
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
        let tempIconMap = {};
        const grouped = data.reduce((acc, item) => {
          const category = item["Category"];
          if (!category) return acc;
          if (!acc[category]) acc[category] = [];
          if (!tempIconMap[category]) {
            tempIconMap = {
              ...tempIconMap,
              [category]: (
                <img
                  src={item["Icon Url"]}
                  alt={category}
                  style={{ height: "25px" }}
                />
              ),
            };
          }
          acc[category].push({
            title: item["Title"],
            content: item["Content"],
            image: item["Image Url"]
              ? item["Image Url"].split(",").map((i) => i.trim())
              : [],
            video: item["Video Url"],
          });
          return acc;
        }, {});
        setIconMaps(tempIconMap);

        const formatted = Object.entries(tempIconMap).map(([category]) => ({
          category,
          topics: grouped[category] || [],
        }));

        setHelpTopics(formatted);
        setFilteredTopics(formatted);

        // Auto-select the first available topic
        const firstTopic =
          formatted.find((g) => g.topics.length)?.topics[0] || "";
        setSelectedTopic(firstTopic);
      })
      .catch((err) => {
        toast.error("Unable to fetch data from sheet");
      });
  };

  const getPreviewLink = (url) => {
    const match = url.match(/\/file\/d\/([^/]+)\//);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  const getImageLink = (url) => {
    const match = url.match(/\/file\/d\/([^/]+)\//) || url.match(/id=([^&]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const filterData = (searchQuery) => {
    let tempFilteredTopics = [];
    helpTopics.map((group) => {
      const tempTopics = group.topics.filter((t) =>
        t.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (tempTopics.length > 0) {
        tempFilteredTopics.push({ ...group, topics: tempTopics });
      }
    });
    setFilteredTopics(tempFilteredTopics);
    setExpandedCategory(0);
    // const firstTopic =
    //   tempFilteredTopics.find((g) => g.topics.length)?.topics[0] || "";
    // setSelectedTopic(firstTopic);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full bg-white px-6 py-6 shadow-md overflow-y-auto text-[15px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 tracking-wide">
          Help Center
        </h2>
        <Input
          placeholder="Search help..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value.length > 0) {
              filterData(e.target.value);
            } else {
              setFilteredTopics(helpTopics);
              setExpandedCategory(null);
            }
          }}
          className="mb-5 rounded-md"
        />
        <ScrollArea className="h-[calc(100vh-160px)] pr-1">
          {iconMaps &&
            filteredTopics.map((group, i) => (
              <div key={i} className="mb-5">
                <button
                  className="w-full flex items-center gap-2 text-left font-medium text-gray-700 hover:text-blue-700 transition-colors text-base py-1.5 cursor-pointer"
                  onClick={() =>
                    setExpandedCategory(expandedCategory === i ? null : i)
                  }
                >
                  {/* {iconMaps[group.category]} {group.category} */}
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
                            {parseBoldText(topic.title)}
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
        <div className="mx-auto w-full overflow-y-auto">
          {selectedTopic ? (
            <div className="bg-white rounded-xl p-8 space-y-6 transition-all duration-300 h-full">
              <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-semibold text-blue-800">
                  {parseBoldText(selectedTopic.title)}
                </h2>
              </div>
              <div className="prose max-w-none text-gray-800 space-y-4">
                {selectedTopic.content?.split("\n").map((line, i) => (
                  <p key={i} className="leading-relaxed">
                    {parseBoldText(line)}
                  </p>
                ))}
              </div>
              {selectedTopic.video && (
                <div className="relative overflow-hidden rounded-xl shadow-md">
                  <iframe
                    src={getPreviewLink(selectedTopic.video)}
                    title="Help video"
                    className="w-full h-96"
                    loading="lazy"
                    allow="autoplay"
                    allowFullScreen
                  />
                  {/* <video controls>
                    <source src={selectedTopic.video} type="video/webm" />
                    <source src={selectedTopic.video} type="video/mp4" />
                    Download the
                    <a href={selectedTopic.video}>WEBM</a>
                    or
                    <a href={selectedTopic.video}>MP4</a>
                    video.
                  </video> */}
                </div>
              )}
              {!selectedTopic.video &&
                selectedTopic.image &&
                selectedTopic.image.map((image, idx) => {
                  // console.log(image);
                  return (
                    <FallbackImage
                      key={idx}
                      src={image}
                      alt={selectedTopic.title}
                      getPreviewLink={getPreviewLink}
                    />
                  );
                })}
              <div className="mt-6 pt-4 border-t border-gray-200">
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

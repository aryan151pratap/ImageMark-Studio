import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";

const models = [
  { rank: 1, name: "yolov8n.pt", speed: "⭐⭐⭐⭐⭐", accuracy: "⭐", size: "~5 MB", version: "YOLOv8" },
  { rank: 2, name: "yolov5n.pt", speed: "⭐⭐⭐⭐", accuracy: "⭐", size: "~7 MB", version: "YOLOv5" },
  { rank: 3, name: "yolov9n.pt", speed: "⭐⭐⭐⭐", accuracy: "⭐⭐", size: "~6 MB", version: "YOLOv9" },
  { rank: 4, name: "yolov7-tiny.pt", speed: "⭐⭐⭐⭐", accuracy: "⭐⭐", size: "~11 MB", version: "YOLOv7" },
  { rank: 5, name: "yolov8s.pt", speed: "⭐⭐⭐", accuracy: "⭐⭐", size: "~22 MB", version: "YOLOv8" },
  { rank: 6, name: "yolov5s.pt", speed: "⭐⭐⭐", accuracy: "⭐⭐", size: "~27 MB", version: "YOLOv5" },
  { rank: 7, name: "yolov9s.pt", speed: "⭐⭐⭐", accuracy: "⭐⭐⭐", size: "~25 MB", version: "YOLOv9" },
  { rank: 8, name: "yolov6s.pt", speed: "⭐⭐⭐", accuracy: "⭐⭐", size: "~30 MB", version: "YOLOv6" },
  { rank: 9, name: "yolov8m.pt", speed: "⭐⭐", accuracy: "⭐⭐⭐", size: "~50 MB", version: "YOLOv8" },
  { rank: 10, name: "yolov5m.pt", speed: "⭐⭐", accuracy: "⭐⭐⭐", size: "~89 MB", version: "YOLOv5" },
  { rank: 11, name: "yolov9m.pt", speed: "⭐⭐", accuracy: "⭐⭐⭐⭐", size: "~50 MB", version: "YOLOv9" },
  { rank: 12, name: "yolov7.pt", speed: "⭐⭐", accuracy: "⭐⭐⭐⭐", size: "~70 MB", version: "YOLOv7" },
  { rank: 13, name: "yolov6m.pt", speed: "⭐⭐", accuracy: "⭐⭐⭐⭐", size: "~100 MB", version: "YOLOv6" },
  { rank: 14, name: "yolov8l.pt", speed: "⭐", accuracy: "⭐⭐⭐⭐", size: "~70 MB", version: "YOLOv8" },
  { rank: 15, name: "yolov5l.pt", speed: "⭐", accuracy: "⭐⭐⭐⭐", size: "~130 MB", version: "YOLOv5" },
  { rank: 16, name: "yolov9l.pt", speed: "⭐", accuracy: "⭐⭐⭐⭐⭐", size: "~80 MB", version: "YOLOv9" },
  { rank: 17, name: "yolov7-e6.pt", speed: "⭐", accuracy: "⭐⭐⭐⭐⭐", size: "~125 MB", version: "YOLOv7" },
  { rank: 18, name: "yolov8x.pt", speed: "⏳", accuracy: "⭐⭐⭐⭐⭐", size: "~125 MB", version: "YOLOv8" },
  { rank: 19, name: "yolov5x.pt", speed: "⏳", accuracy: "⭐⭐⭐⭐⭐", size: "~160 MB", version: "YOLOv5" },
  { rank: 20, name: "yolov9x.pt", speed: "⏳", accuracy: "⭐⭐⭐⭐⭐⭐", size: "~100 MB", version: "YOLOv9" },
];

const versionColors = {
  "YOLOv5": "bg-blue-100 text-blue-800",
  "YOLOv6": "bg-purple-100 text-purple-800",
  "YOLOv7": "bg-pink-100 text-pink-800",
  "YOLOv8": "bg-green-100 text-green-800",
  "YOLOv9": "bg-yellow-100 text-yellow-800"
};

const speedColors = {
  "⭐⭐⭐⭐⭐": "bg-green-100 text-green-800",
  "⭐⭐⭐⭐": "bg-teal-100 text-teal-800",
  "⭐⭐⭐": "bg-blue-100 text-blue-800",
  "⭐⭐": "bg-yellow-100 text-yellow-800",
  "⭐": "bg-orange-100 text-orange-800",
  "⏳": "bg-red-100 text-red-800"
};

const accuracyColors = {
  "⭐": "bg-red-100 text-red-800",
  "⭐⭐": "bg-orange-100 text-orange-800",
  "⭐⭐⭐": "bg-yellow-100 text-yellow-800",
  "⭐⭐⭐⭐": "bg-green-100 text-green-800",
  "⭐⭐⭐⭐⭐": "bg-teal-100 text-teal-800",
  "⭐⭐⭐⭐⭐⭐": "bg-blue-100 text-blue-800"
};

const ModelList = () => {
  const [filter, setFilter] = useState("all");
  const [sortField, setSortField] = useState("rank");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredModels = filter === "all" 
    ? models 
    : models.filter(model => model.version === filter);

  const sortedModels = [...filteredModels].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortField === "speed" || sortField === "accuracy") {
      // Compare star ratings: more stars = higher value
      const aStars = aValue.replace(/[^⭐⏳]/g, "").length;
      const bStars = bValue.replace(/[^⭐⏳]/g, "").length;
      
      if (aStars === bStars) {
        // Handle special case for "⏳" which should be lower than 1 star
        if (aValue.includes("⏳") && !bValue.includes("⏳")) return 1;
        if (!aValue.includes("⏳") && bValue.includes("⏳")) return -1;
        return 0;
      }
      
      return sortDirection === "asc" ? aStars - bStars : bStars - aStars;
    }
    
    if (sortField === "size") {
      // Extract numeric value from size string
      const aSize = parseFloat(a.size.replace("~", "").replace(" MB", ""));
      const bSize = parseFloat(b.size.replace("~", "").replace(" MB", ""));
      return sortDirection === "asc" ? aSize - bSize : bSize - aSize;
    }
    
    return sortDirection === "asc" 
      ? aValue > bValue ? 1 : -1 
      : aValue < bValue ? 1 : -1;
  });

  const SortIcon = ({ field }) => (
    <span className="ml-1">
      {sortField === field ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="w-full mx-auto p-2 sm:p-4">
      <div className="bg-white sm:p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="border border-indigo-100 p-4 rounded-xl shadow-md">
            <h1 className="flex gap-2 items-center text-center font-bold text-gray-800">
              <FaRobot className="text-4xl p-2 rounded-full bg-indigo-200 text-indigo-500"/>
              <p className="md:text-3xl text-xl">YOLO Models Comparison</p>
            </h1>
            <p className="text-center text-gray-600 mt-2 px-4 sm:px-10">
              Ranked from fastest to highest accuracy. Filter by version or sort by any column.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 w-full md:w-auto">
            <p className="font-medium text-gray-700">Key Metrics</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Speed: ⭐⭐⭐⭐⭐ = Fastest</span>
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Accuracy: ⭐⭐⭐⭐⭐ = Highest</span>
              <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">Size: Smaller = Better</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs sm:text-sm items-center justify-center sm:justify-start flex flex-wrap gap-3 mb-6">
          <button 
            onClick={() => setFilter("all")} 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "all" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Models
          </button>
          {[...new Set(models.map(model => model.version))].map(version => (
            <button
              key={version}
              onClick={() => setFilter(version)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === version
                  ? `${versionColors[version]} shadow-md font-bold`
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {version}
            </button>
          ))}
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="text-xs sm:text-sm min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("rank")}
                >
                  <div className="flex items-center">
                    Rank <SortIcon field="rank" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Model Name
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("speed")}
                >
                  <div className="flex items-center">
                    Speed <SortIcon field="speed" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("accuracy")}
                >
                  <div className="flex items-center">
                    Accuracy <SortIcon field="accuracy" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("size")}
                >
                  <div className="flex items-center">
                    Size <SortIcon field="size" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Version
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedModels.map((model) => (
                <tr 
                  key={model.rank} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium">
                      #{model.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {model.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${speedColors[model.speed]}`}>
                    {model.speed}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${accuracyColors[model.accuracy]}`}>
                    {model.accuracy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {model.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${versionColors[model.version]}`}>
                      {model.version}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredModels.length} of {models.length} models • 
          Sorted by: <span className="font-medium">{sortField}</span> ({sortDirection})
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-sm sm:text-lg text-gray-800 mb-3">About Speed Ratings</h3>
          <ul className="space-y-2">
            <li className="flex items-center"><span className="text-green-600 mr-2">⭐⭐⭐⭐⭐</span> {`Real-time (>100 FPS)`}</li>
            <li className="flex items-center"><span className="text-teal-600 mr-2">⭐⭐⭐⭐</span> Very Fast (60-100 FPS)</li>
            <li className="flex items-center"><span className="text-blue-600 mr-2">⭐⭐⭐</span> Fast (30-60 FPS)</li>
            <li className="flex items-center"><span className="text-yellow-600 mr-2">⭐⭐</span> Moderate (15-30 FPS)</li>
            <li className="flex items-center"><span className="text-orange-600 mr-2">⭐</span> Slow (5-15 FPS)</li>
            <li className="flex items-center"><span className="text-red-600 mr-2">⏳</span> {`Very Slow (<5 FPS)`}</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-3">About Accuracy Ratings</h3>
          <ul className="space-y-2">
            <li className="flex items-center"><span className="text-red-600 mr-2">⭐</span> Low (50-60% mAP)</li>
            <li className="flex items-center"><span className="text-orange-600 mr-2">⭐⭐</span> Moderate (60-70% mAP)</li>
            <li className="flex items-center"><span className="text-yellow-600 mr-2">⭐⭐⭐</span> Good (70-75% mAP)</li>
            <li className="flex items-center"><span className="text-green-600 mr-2">⭐⭐⭐⭐</span> Very Good (75-80% mAP)</li>
            <li className="flex items-center"><span className="text-teal-600 mr-2">⭐⭐⭐⭐⭐</span> Excellent (80-85% mAP)</li>
            <li className="flex items-center"><span className="text-blue-600 mr-2">⭐⭐⭐⭐⭐⭐</span> {`State-of-the-Art (>85% mAP)`}</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
              <span><strong>Edge devices:</strong> Nano models (yolov8n, yolov5n)</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
              <span><strong>Balanced performance:</strong> Small models (yolov8s, yolov9s)</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
              <span><strong>High accuracy:</strong> Large models (yolov9l, yolov8x)</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
              <span><strong>Latest models:</strong> YOLOv9 series offers best accuracy/size ratio</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Performance Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-1">⚡</div>
              <div>
                <p className="font-medium">Speed vs Accuracy Trade-off</p>
                <p className="text-sm text-gray-600">Smaller models (nano, small) are faster but less accurate</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 text-purple-800 rounded-full p-1 mr-2 mt-1">🎯</div>
              <div>
                <p className="font-medium">YOLOv9 Accuracy</p>
                <p className="text-sm text-gray-600">YOLOv9 models show higher accuracy at similar sizes</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2 mt-1">📊</div>
              <div>
                <p className="font-medium">Model Size Matters</p>
                <p className="text-sm text-gray-600">Larger models (x-large) provide higher accuracy but are slower</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200 md:col-span-2">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-700 mb-2">For Edge Devices</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Use YOLOv8n or YOLOv5n for maximum speed</li>
                <li>Small model size ideal for mobile deployment</li>
                <li>Balanced performance for real-time detection</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <h4 className="font-bold text-purple-700 mb-2">For High Accuracy</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Choose YOLOv9x or YOLOv7-e6</li>
                <li>Larger models provide best detection quality</li>
                <li>Require more computational resources</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h4 className="font-bold text-green-700 mb-2">Balanced Choice</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>YOLOv8m or YOLOv9s offer good balance</li>
                <li>Reasonable speed with improved accuracy</li>
                <li>Versatile for most applications</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <h4 className="font-bold text-orange-700 mb-2">Latest Models</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>YOLOv9 offers improved accuracy</li>
                <li>YOLOv8 has excellent documentation</li>
                <li>Consider project requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Note: Performance metrics are relative comparisons based on standard benchmarks</p>
        <p className="mt-1">Actual performance may vary based on hardware and implementation</p>
      </div>
    </div>
  );
};

export default ModelList;
import { useState, useMemo, useEffect } from 'react';
import { FaTrash, FaEdit, FaSearch, FaSort, FaSortUp, FaSortDown, FaSave } from 'react-icons/fa';
import YoloExporter from './yoloExporter';

const apiUrl = import.meta.env.VITE_API_URL;

function Labels({ boxes, onDelete, onEdit, onSelect, imgWidth, imgHeight, user, folder, name, selectedFolder, setSelectedFolder, colors, hexToRgba }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(name){
      setFilename(name.split('.')[0]);
    }
  }, [name])

  useEffect(() => {
    const save_label = async function(){
      try {
        const res = await fetch(`${apiUrl}/api/update/${user}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            labels: boxes,
            folder: selectedFolder,
          }),
        });
        const data = await res.json();
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    if(boxes && boxes.length > 0){
      save_label();
    }
  }, [boxes, selectedFolder])

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
    return sortConfig.direction === 'ascending'
      ? <FaSortUp className="ml-1 text-blue-600" />
      : <FaSortDown className="ml-1 text-blue-600" />;
  };

  const sortedBoxes = useMemo(() => {
    if (!sortConfig.key) return boxes;
    return [...boxes].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [boxes, sortConfig]);

  const filteredBoxes = useMemo(() => {
    if (!searchTerm) return sortedBoxes;
    const term = searchTerm.toLowerCase();
    return sortedBoxes.filter(box =>
      box.label.toLowerCase().includes(term) ||
      box.x.toString().includes(term) ||
      box.y.toString().includes(term) ||
      box.width.toString().includes(term) ||
      box.height.toString().includes(term)
    );
  }, [sortedBoxes, searchTerm]);

  const handle_Save = async (e) => {
    e.preventDefault();
    if (!boxes || !selectedFolder || !filename.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user,
          filename: filename.trim(),
          folder: selectedFolder,
          imgHeight,
          imgWidth,
          labels: boxes
        })
      });
      const data = await res.json();
      if (res.ok) {
        set
        console.log('Saved successfully');
      } else {
        console.error('Failed to save', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col h-full rounded-lg shadow-sm overflow-hidden">
      {boxes.length > 0 &&
      <div className="p-4 border-b border-gray-200 flex flex-row gap-2">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search annotations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <form className="flex flex-row gap-2 items-center justify-center" onSubmit={handle_Save}>
          <div className="bg-slate-200 p-1.5 rounded border-1">
            <select
              className="outline-none"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              required
            >
              <option value="">Select folder</option>
              {folder?.map((i, index) => (
                <option key={index} value={i.folder}>{i.folder}</option>
              ))}
            </select>
          </div>
          <div className="border h-full flex items-center justify-center px-1.5 rounded">
            <input
              type="text"
              className="w-fit outline-none"
              placeholder="Enter file name"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="flex flex-row gap-1 items-center bg-green-600 p-1.5 text-white rounded-sm">
            <FaSave />
            Save
            {loading &&
            <div className="flex justify-center items-center">
              <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
            }
          </button>
        </form>
      </div>
      }

      {boxes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center p-6 text-gray-500">
          No annotations created yet
        </div>
      ) : (
        <div className="overflow-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th onClick={() => requestSort('label')} className="cursor-pointer px-4 py-3 text-left font-semibold text-gray-600">
                  <div className="flex items-center">Label {getSortIcon('label')}</div>
                </th>
                <th onClick={() => requestSort('x')} className="cursor-pointer px-4 py-3 text-left font-semibold text-gray-600">
                  <div className="flex items-center">X {getSortIcon('x')}</div>
                </th>
                <th onClick={() => requestSort('y')} className="cursor-pointer px-4 py-3 text-left font-semibold text-gray-600">
                  <div className="flex items-center">Y {getSortIcon('y')}</div>
                </th>
                <th onClick={() => requestSort('width')} className="cursor-pointer px-4 py-3 text-left font-semibold text-gray-600">
                  <div className="flex items-center">Width {getSortIcon('width')}</div>
                </th>
                <th onClick={() => requestSort('height')} className="cursor-pointer px-4 py-3 text-left font-semibold text-gray-600">
                  <div className="flex items-center">Height {getSortIcon('height')}</div>
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 overflow-auto">
              {filteredBoxes.map((box, index) => (
                <tr key={index} className="hover:bg-blue-50 transition-all cursor-pointer" 
                  style={{color: colors[(index) % colors.length] , backgroundColor: hexToRgba(colors[(index) % colors.length], 0.3)}}
                  onClick={() => onSelect?.(index)}>
                  <td className="px-4 py-2 font-medium text-gray-800">{box.label}</td>
                  <td className="px-4 py-2 text-gray-700">{box.x.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-700">{box.y.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-700">{box.width.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-700">{box.height.toFixed(2)}</td>
                  <td className="px-4 py-2 flex items-center justify-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onEdit?.(index); }} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete?.(index); }} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBoxes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center px-4 py-8 text-gray-400">
                    No matching annotations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {filteredBoxes.length > 0 && (
        <div className="p-2 border-t border-zinc-300 bg-gray-50 flex justify-between items-center">
          <YoloExporter boxes={boxes} imgWidth={imgWidth} imgHeight={imgHeight} />
        </div>
      )}
    </div>
  );
}

export default Labels;

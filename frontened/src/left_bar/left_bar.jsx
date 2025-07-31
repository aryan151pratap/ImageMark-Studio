import { useState, useRef, useEffect } from "react";
import {
  FaAlignLeft,
  FaAngleDown,
  FaAngleRight,
  FaFolder,
  FaBars,
  FaPlus,
  FaTrash,
  FaEllipsisV,
  FaPencilAlt,
  FaFile,
  FaDownload,
  FaSafari,
  FaSadCry,
} from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

function Left_bar({ user, folders, setFolders, setFiles, currentFile, setCurrentFile, setOpenContent, setFile, file }) {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [addfolder, setAddfolder] = useState("");
  const [currentFolder, setCurrentFolder] = useState([]);
  const [option, setOption] = useState(null);
  const [renameIndex, setRenameIndex] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  
  const [loading, setLoading] = useState(false);
  const optionRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedInsideAny = false;
      Object.values(optionRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedInsideAny = true;
        }
      });
      if (!clickedInsideAny) {
        setOption(null);
        setRenameIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handle_save_folder = async (e) => {
    e.preventDefault();
    const trimmed = addfolder.trim();

    if (!trimmed) return;
    try {
      const res = await fetch(`${apiUrl}/api/folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user,
          folder: addfolder,
          labels: []
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFolders((e) => [...e, {folder: addfolder}]);
        setAddfolder("");
        console.log('Saved successfully');
      } else {
        console.error('Failed to save', data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handle_current_folder = async (i) => {
    if (currentFolder.includes(i)) {
      const updated = currentFolder.filter((e) => e !== i);
      setCurrentFolder(updated);

      const updatedFiles = file.filter((file) => file.folder !== i);
      setFile(updatedFiles);
    } else {
      try {
        setLoading(i);
        setCurrentFolder((e) => [...e, i]);
        const res = await fetch(`${apiUrl}/api/files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user,
            folder: i,
          })
        });
        const data = await res.json();
        if (res.ok) {
          setFile((e) => [...e, {folder: data.files.folder, files: data.files.files}]);
          console.log('files name get successfully');
        } else {
          console.error('Failed to save', data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(null);
      }
    }
  };

  const handle_delete_folder = async (folderName) => {
    if (!folderName) return
    setOption(null);
    if (!window.confirm(`Are you sure you want to delete folder "${folderName}"?`)) return;
    try {
      const res = await fetch(`${apiUrl}/api/delete/${user}/${folderName}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setFolders((prev) => prev.filter((item) => item.folder !== folderName ));
        if (currentFolder === folderName) setCurrentFolder(null);
        setOption(null);
        console.log("Folder deleted successfully");
      } else {
        console.error("Failed to delete folder:", data);
      }
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  const handle_rename_folder = (folder) => {
    setRenameIndex(folder);
    setRenameValue(folder);
    setOption(null);
  };

  const handle_rename_submit = async (oldName) => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== oldName) {
      try {
        const res = await fetch(`${apiUrl}/api/rename`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user,
            folder: trimmed,
            oldName: oldName
          })
        });
        const data = await res.json();
        if (res.ok) {
          setFolders((prev) =>
            prev.map((item) =>
              item.folder === oldName ? { ...item, folder: trimmed } : item
            )
          );
          setRenameIndex(null);
          console.log('Saved successfully');
        } else {
          console.error('Failed to save', data);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };


  return (
    <div className="flex h-full">
      <div className={`p-2 ${open ? "border-r" : ""} border-slate-200`}>
        <button
          onClick={() => {
            setOpen(!open);
            setAdd(false);
          }}
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {open && (
        <div className="h-full w-full sm:w-48 flex flex-col text-white">
          <div className="w-full p-2 border-b border-slate-200 flex">
            <div
              className="ml-auto text-black items-center flex"
              onClick={() => setAdd(!add)}
            >
              <FaPlus className="text-slate-500 text-md border border-slate-500 p-[2px] cursor-pointer hover:text-slate-700 hover:border-slate-700" />
            </div>
          </div>

          {add && (
            <form
              className="p-1 flex flex-row gap-1 border-b border-slate-200 items-center"
              onSubmit={handle_save_folder}
            >
              <FaFolder className="text-xs text-slate-400" />
              <input
                type="text"
                value={addfolder}
                className="p-1 w-full text-black outline-none rounded"
                placeholder="Enter folder name..."
                onChange={(e) => setAddfolder(e.target.value)}
              />
            </form>
          )}

          <div className="h-full overflow-auto">
            {folders?.length > 0 ?
            <div className="text-black h-full flex flex-col overflow-auto">
              {folders?.map((folder, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center sm:border-b border-slate-200 cursor-pointer hover:bg-slate-50"
                  ref={(el) => (optionRefs.current[folder.folder] = el)}
                >
                  <div className="relative w-full flex items-center">
                    <div
                      className="p-1 w-full flex flex-row items-center gap-2"
                      onClick={() => handle_current_folder(folder.folder)}
                    >
                      {currentFolder.includes(folder.folder) ? (
                        <div>
                          <FaAngleDown />
                        </div>
                      ) : (
                        <FaAngleRight />
                      )}
                      {renameIndex === folder.folder ? (
                        <input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handle_rename_submit(folder.folder)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handle_rename_submit(folder.folder);
                            }
                          }}
                          autoFocus
                          className="p-1 text-sm w-full rounded border border-slate-300"
                        />
                      ) : (
                        <span className="font-semibold">{folder.folder}</span>
                      )}
                    </div>
                    <FaEllipsisV
                      className="text-slate-400 hover:text-slate-600"
                      onClick={() =>
                        option === folder.folder ? setOption(null) : setOption(folder.folder)
                      }
                    />
                  </div>
                  {(loading === folder.folder) ?
                    <div className="w-full flex items-center justify-center p-2 border-t border-slate-200">
                      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin border-slate-500"></div>
                    </div>

                    :

                    currentFolder.includes(folder.folder) && (
                      <div className="w-full grid grid-cols-2 sm:flex sm:flex-col border-t border-slate-200">
                        {file?.map((i, index_1) => {
                          if (i.folder === folder.folder) {
                            return i.files?.map((j, index_2) => (
                              <div
                                key={index_2}
                                className={`text-slate-700 flex flex-row gap-2 items-center px-4 p-1 bg-slate-100 
                                  ${(i.files.length % 2 === 0 ? index_2 >= i.files.length-2 : index_2 >= i.files.length-1) ? '' : 'border-b'} 
                                  sm:border-b sm:last:border-b-0 border-r sm:border-r-0 border-slate-200 ${currentFile?.filename === j.filename ? 'bg-slate-700 text-white' : ''} hover:bg-slate-900 hover:text-white`}
                                onClick={() => {
                                  setFiles((prev) => {
                                    const exists = prev.some(
                                      (f) => f.folder === i.folder && f.filename === j.filename
                                    );
                                    if (!exists) {
                                      return [...prev, { folder: i.folder, filename: j.filename }];
                                    }
                                    return prev;
                                  });
                                  setCurrentFile({ folder: i.folder, filename: j.filename });
                                }}
                              >
                                <FaFile />
                                <span className="text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">{j.filename}</span>
                              </div>
                            ));
                          }
                          return null;
                        })}
                      </div>
                    )                  
                  }


                  {option === folder.folder && (
                    <div className="absolute top-8 right-1 border-2 border-slate-200 w-30 bg-slate-100 rounded-md shadow-lg z-10 overflow-hidden">
                      <button
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-slate-500/20 hover:text-slate-400"
                        onClick={() => handle_rename_folder(folder.folder)}
                      >
                        <FaPencilAlt className="text-slate-400" />
                        Rename
                      </button>
                      <button
                        className="flex items-center border-t-2 border-slate-200 gap-2 w-full px-4 py-2.5 text-left hover:bg-red-500/20 hover:text-red-300"
                        onClick={() => handle_delete_folder(folder.folder)}
                      >
                        <FaTrash className="text-red-400" />
                        Delete
                      </button>
                      <button
                        className="flex items-center border-t-2 border-slate-200 gap-2 w-full px-4 py-2.5 text-left hover:bg-red-500/20 hover:text-red-300"
                        onClick={() => {
                          setFiles([]);
                          setOpenContent(folder.folder);
                          setOption(null);
                        }}
                      >
                        <FaDownload className="text-red-400" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            :
            <div className="h-[50%] text-slate-500 p-2 w-full items-center flex gap-2 justify-center">
              <FaSadCry/>
              No Folder Added
            </div>
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default Left_bar;

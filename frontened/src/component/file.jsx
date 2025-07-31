import { useEffect, useRef, useState } from "react";
import { FaSadCry, FaSadTear, FaSave, FaTimes, FaTractor, FaTrash } from "react-icons/fa";
import Yolo from "./yolo";

const apiUrl = import.meta.env.VITE_API_URL;

function File({ files, user, currentFile, setCurrentFile, setFiles, setFile, file }) {
	const [file_data, setFile_data] = useState(null);
	const [features, setFeatures] = useState(['table', 'image HxW', 'labels'])
	const [currentFeature, setCurrentFeature] = useState('table');
	const [loading, setLoading] = useState(false);
	const lastFetchedFileRef = useRef(null); 
	const [labels, setLabels] = useState([]);
	const [rename, setRename] = useState('');
	const [open_rename, setOpen_rename] = useState(false);

	useEffect(() => {
		if (files.length > 0) {
			const current = files[files.length - 1];
			setCurrentFile(current);
		}
	}, [files]);

	const handleTabClick = (file) => {		
		setCurrentFile(file);
	};

	useEffect(() => {
		const file_data = async function () {
			try {
				setLoading(true);
				const res = await fetch(`${apiUrl}/api/file_data/${user}/${currentFile.folder}/${currentFile.filename}`, {
					method: 'GET',
				});
				const data = await res.json();
				if (res.ok) {
					setFile_data(data.file_data);
					setLabels(data.labels);
					lastFetchedFileRef.current = currentFile; // update last fetched
					console.log('Fetched successfully');
				} else {
					console.error('Failed to fetch', data);
				}
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};

		if (
			currentFile &&
			!(
				lastFetchedFileRef.current &&
				lastFetchedFileRef.current.folder === currentFile.folder &&
				lastFetchedFileRef.current.filename === currentFile.filename
			)
		) {
			file_data();
		}
	}, [currentFile]);

	const handle_delete = function(file){
		if(file){
			const updated = files.filter(
				(i) => !(i.folder === file.folder && i.filename === file.filename)
			);			
			setFiles(updated)
		}
	}

	const handle_delete_file = async function(e){
		if (!window.confirm(`Are you sure you want to delete "${e.filename}"?`)) return;

		try{
			const res = await fetch(`${apiUrl}/api/delete_file/${user}/${currentFile.folder}/${currentFile.filename}`, {
				method: 'DELETE',
			});
			const data = await res.json();
			if (res.ok) {
				const updated = files.filter(
					(i) => !(i.folder === e.folder && i.filename === e.filename)
				);
				setFile(file.map(f =>
					f.folder === e.folder
						? { ...f, files: f.files.filter(i => i.filename !== e.filename) }
						: f
				))
				setFiles(updated)
				console.log('Delete file successfully');
			} else {
				console.error('Failed to fetch', data);
			}
		} catch (err) {
			console.log(err);
		}
	}

	const handle_rename_file = async function(e){
		try{
			const res = await fetch(`${apiUrl}/api/rename_file/${user}/${currentFile.folder}/${currentFile.filename}/${rename}`, {
				method: 'GET',
			});
			const data = await res.json();
			if (res.ok) {
				const updated = files.map(i =>
					i.folder === e.folder && i.filename === e.filename
						? { ...i, filename: rename }
						: i
				);
				setFile(file.map(f =>
					f.folder === e.folder
						? {
							...f,
							files: f.files.map(i =>
								i.filename === e.filename
									? { ...i, filename: rename }
									: i
							)
						}
						: f
				));
				setFiles(updated);
				setRename('');
				console.log('Delete file successfully');
			} else {
				console.error('Failed to fetch', data);
			}
		} catch (err) {
			console.log(err);
		}
	}


	return (
		<div className="w-full h-full bg-white border-l border-slate-200">
			<div className="w-full h-full flex flex-col md:flex-row">
				<div className="w-full">
					<div className="flex flex-row border-b border-slate-200 w-full h-fit overflow-auto scrollbar-hide">
						{files.map((file, index) => (
							<div
							key={index}
							className={`border-r border-slate-200 px-2 py-1 flex flex-row gap-2 items-center cursor-pointer
								${currentFile?.filename === file.filename ? 'bg-slate-700 text-white' : 'bg-white hover:bg-slate-200'}`}>
								<p className="text-center whitespace-nowrap"
									onClick={() => handleTabClick(file)}
								>{file.filename}</p>
								<FaTimes className={`text-sm hover:text-red-500 ${currentFile?.filename === file.filename ? 'text-white' : 'text-slate-500'}`}
									onClick={() => handle_delete(file)}
								/>
							</div>
						))}
					</div>
					{loading ?
					<div className="flex flex-col gap-4 justify-center items-center h-50 md:h-full">
						<div className="w-12 h-12 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
						<span>Loading....</span>
					</div>	
					:
					<div className="border-b border-slate-200">
						<div className="flex flex-row border-b border-slate-200">
							{features.map((i, index_1) => (
								<button className={`px-2 py-1 border-r border-slate-200 capitalize text-sm cursor-pointer hover:bg-slate-700 hover:text-white
													${currentFeature === i ? 'bg-slate-900 text-white' : ''}	
												`}
									onClick={() => setCurrentFeature(i)}
								>
									<span className="text-center whitespace-nowrap">{i}</span>
								</button>
							))}
							<div className="ml-auto flex flex-row overflow-auto">
								{open_rename &&
								<input type="text" 
									value={rename}
									onChange={(e) => setRename(e.target.value)}
									className="outline-none border border-blue-500 px-2 bg-blue-100 text-blue-700 text-sm"
									placeholder="Enter new name . . . ."
								/>
								}
								<button className="flex gap-2 p-1 items-center text-sm px-2 ml-auto border border-green-400 text-green-700 bg-green-200 hover:text-green-200 hover:bg-green-700 cursor-pointer"
									onClick={() => {
										if(open_rename){
											if(rename.trim()) handle_rename_file(currentFile);
											setOpen_rename(false);
										} else {
											setOpen_rename(true);
										}
									}}
								>
									{open_rename ? <FaSave/> : <FaTrash/>}
									{open_rename ? 'Save' : 'Rename'}
								</button>
								<button className="flex gap-2 p-1 items-center text-sm px-2 ml-auto border border-red-400 text-red-700 bg-red-200 hover:text-red-200 hover:bg-red-700 cursor-pointer"
									onClick={() => handle_delete_file(currentFile)}
								>
									<FaTrash/>
									Delete File
								</button>
							</div>	
						</div>
						{file_data?.labels?.length > 0 ?
							currentFeature === 'table' ?
								<div className="w-full h-[84vh] overflow-y-auto p-2">
									<table className="max-w-full table-auto border border-collapse border-gray-300 text-sm">
										<thead className="bg-slate-200 text-left">
										<tr>
											<th className="border px-4 py-2">#</th>
											<th className="border px-4 py-2">Label</th>
											<th className="border px-4 py-2">X</th>
											<th className="border px-4 py-2">Y</th>
											<th className="border px-4 py-2">Width</th>
											<th className="border px-4 py-2">Height</th>
										</tr>
										</thead>
										<tbody>
										{file_data?.labels?.map((i, index) => (
											<tr key={index} className="hover:bg-slate-100">
											<td className="border px-4 py-2">{index + 1}</td>
											<td className="border px-4 py-2">{i.label}</td>
											<td className="border px-4 py-2">{i.x}</td>
											<td className="border px-4 py-2">{i.y}</td>
											<td className="border px-4 py-2">{i.width}</td>
											<td className="border px-4 py-2">{i.height}</td>
											</tr>
										))}
										</tbody>
									</table>
								</div>
								:
								currentFeature === 'labels' ?
								<div className="flex flex-col h-[84vh] overflow-auto">
									{labels?.map((i, index) => (
										<divc className="px-2 py-1">
											<span className="mr-2 text-xs">{index}</span>{i}
										</divc>
									))}
								</div>
								:
								<div className="flex flex-col p-2">
									<p className="flex gap-2">
										<span>Image Height</span>
										<span>{file_data.img_height}</span>
									</p>
									<p className="flex gap-2">
										<span>Image width</span>
										<span>{file_data.img_width}</span>
									</p>
								</div>
							:
							<div className="w-full h-[400px] text-slate-400 text-xl p-2 items-center flex flex-row justify-center gap-2">
								<FaSadTear/>
								<span>No labelling data!</span>
							</div>
						}
					</div>
					}
				</div>
				{!loading &&
					<div className="w-full h-[88vh]">
						<Yolo file_data={file_data} labels={labels}/>
					</div>
				}
			</div>
		</div>
	);
}

export default File;

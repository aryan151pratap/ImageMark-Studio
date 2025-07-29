import { FaFile, FaFileAlt, FaHighlighter, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";

function Top_bar({ setOpenContent, setOpenStudio, setFiles, setCurrentFile }){

	const handle_logout = () => {
		localStorage.removeItem('username');
		localStorage.removeItem('email');
		window.location.href = '/';
	};

	return(
		<div className="w-full flex bg-slate-100 text-white">
			<header className="h-12 w-full flex flex-row bg-slate-800 items-center">
				<p className="h-full capitalize items-center flex px-2 font-bold text-lg">
					<div className="relative mr-3">
						<FaFile className="text-green-300 border-3 border-dashed border-green-300 rounded-full"/>
					</div>
					ImageMark Studi<span className="p-[5px] mt-[2px] border-dashed border-3 border-white rounded-full ml-[1px] animate-spin"></span>
				</p>
				<div className="flex gap-2 ml-auto px-2">
					<button
						className="flex gap-1 items-center p-1 border border-green-600 bg-green-700/30 px-2 rounded cursor-pointer hover:bg-green-700/60"
						onClick={() => {
							setOpenStudio(true);
							setOpenContent(false);
							setFiles([]);
							setCurrentFile(null);
						}} 
					>
						<FaHighlighter className="text-green-400"/>
						Studio
					</button>
					<button
						className="flex gap-1 items-center p-1 border border-blue-600 bg-blue-700/30 px-2 rounded cursor-pointer hover:bg-blue-700/60"
						onClick={() => {
							setOpenContent(true);
							setOpenStudio(false);
							setFiles([]);
							setCurrentFile(null);
						}}
					>
						<FaInfoCircle className="text-blue-400"/>
						Content
					</button>
					<button className="flex gap-1 text-red-400 items-center font-semibold border border-red-700  bg-red-700/30 px-2 rounded cursor-pointer hover:bg-red-700/60"
						onClick={handle_logout}
					>
						<FaSignOutAlt/>
						logout
					</button>
				</div>	
			</header>
		</div>
	)
}

export default Top_bar;
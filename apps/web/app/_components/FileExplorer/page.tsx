"use client"
import { Socket } from "socket.io-client"
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react"
import { useState } from "react"

export default function FileExplorer({
  socket,
  replId,
  distanceFromRoot,
  fileGraph,
  currentFile,
  setCurrentFile
}: {
  socket: Socket | null,
  replId: string,
  distanceFromRoot: Record<string, number>,
  fileGraph: Record<string, { fileName: string, filePath: string }[]>,
  currentFile: string,
  setCurrentFile: React.Dispatch<React.SetStateAction<string>>
}) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    [replId as string]: true // Auto-expand root
  });

  const handleClick = (filePath: string) => {
    if (currentFile === filePath) return;
    setCurrentFile(filePath);
    socket?.emit("getFileContent", { replId, filePath })
  }

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }));
  }

  // Check if an item is a folder by checking if it exists as a key in fileGraph
  const isFolder = (fileName: string) => {
    return fileGraph.hasOwnProperty(fileName);
  }

  // Render nested file structure recursively
  const renderFileTree = (parent: string, depth: number = 0) => {
    const children = fileGraph[parent] || [];
    const paddingLeft = 16 + (depth * 16);

    return (
      <div key={parent}>
        {/* Folder */}
        <div
          onClick={() => toggleFolder(parent)}
          className="flex items-center gap-2 py-2 pr-4 hover:bg-gray-100 cursor-pointer group transition-colors"
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {expandedFolders[parent] ? (
            <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
          )}
          <Folder className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="text-sm font-medium text-black truncate">
            {parent}
          </span>
        </div>

        {/* Children */}
        {expandedFolders[parent] && (
          <div>
            {children.map((child, idx) => {
              // Check if this child is a folder
              if (isFolder(child.fileName)) {
                // Recursively render nested folders
                return renderFileTree(child.fileName, depth + 1);
              } else {
                // Render file
                const childPaddingLeft = 16 + ((depth + 1) * 16);
                return (
                  <div
                    key={`${child.filePath}-${idx}`}
                    onClick={() => handleClick(child.filePath)}
                    className={`flex items-center gap-2 py-2 pr-4 cursor-pointer transition-colors ${
                      currentFile === child.filePath
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    style={{ paddingLeft: `${childPaddingLeft}px` }}
                  >
                    <div className="w-4 flex-shrink-0" /> {/* Spacing instead of chevron */}
                    <File className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{child.fileName}</span>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    );
  };

  // Find the root folder (should be the replId)
  const getRootFolder = () => {
    // The root is the folder that contains other items but is not a child of any folder
    const allFolders = Object.keys(fileGraph);
    const childFolders = new Set<string>();
    
    // Collect all folder names that appear as children
    Object.values(fileGraph).forEach(children => {
      children.forEach(child => {
        if (isFolder(child.fileName)) {
          childFolders.add(child.fileName);
        }
      });
    });
    
    // Root is the folder that's not in childFolders
    const roots = allFolders.filter(folder => !childFolders.has(folder));
    return roots[0] || allFolders[0]; // Return first root or fallback to first folder
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-black">Files</h2>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {renderFileTree(getRootFolder() as string, 0)}
      </div>
    </div>
  )
}
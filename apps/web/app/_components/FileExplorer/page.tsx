"use client"
import { Socket } from "socket.io-client"
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react"
import { useState } from "react"

type FileNode = {
  fileName: string
  filePath: string
}

export default function FileExplorer({
  socket,
  replId,
  fileGraph,
  currentFile,
  setCurrentFile
}: {
  socket: Socket | null
  replId: string
  fileGraph: Record<string, FileNode[]>
  currentFile: string
  setCurrentFile: React.Dispatch<React.SetStateAction<string>>
}) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    [replId]: true
  })

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }))
  }

  const handleClick = (filePath: string) => {
    if (currentFile === filePath) return
    setCurrentFile(filePath)
    socket?.emit("getFileContent", { replId, filePath })
  }

  const isFolder = (path: string) => {
    return !!fileGraph[path]
  }

  const getDisplayName = (path: string) => {
    if (path === replId) return replId
    return path.split("/").pop()
  }

  const renderTree = (parentPath: string, depth = 0) => {
    const children = fileGraph[parentPath] || []
    const paddingLeft = 16 + depth * 16

    return (
      <div key={parentPath}>
        {parentPath !== replId && (
          <div
            onClick={() => toggleFolder(parentPath)}
            className="flex items-center gap-2 py-2 pr-4 hover:bg-gray-100 cursor-pointer"
            style={{ paddingLeft }}
          >
            {expandedFolders[parentPath] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Folder className="w-4 h-4" />
            <span className="text-sm font-medium truncate">
              {getDisplayName(parentPath)}
            </span>
          </div>
        )}

        {expandedFolders[parentPath] && (
          <div>
            {children.map(child => {
              const childPadding = 16 + (depth + 1) * 16

              if (isFolder(child.filePath)) {
                return renderTree(child.filePath, depth + 1)
              }

              return (
                <div
                  key={child.filePath}
                  onClick={() => handleClick(child.filePath)}
                  className={`flex items-center gap-2 py-2 pr-4 cursor-pointer transition-colors ${
                    currentFile === child.filePath
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  style={{ paddingLeft: childPadding }}
                >
                  <div className="w-4" />
                  <File className="w-4 h-4" />
                  <span className="text-sm truncate">
                    {child.fileName}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b bg-white">
        <h2 className="text-sm font-semibold">Files</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {renderTree(replId)}
      </div>
    </div>
  )
}

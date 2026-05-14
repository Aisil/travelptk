/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Folder, FileImage, FileVideo, FileText, Upload, Plus, Edit2, Trash2, CheckSquare, X, Save, Copy } from "lucide-react";

type MediaFolder = {
  id: number;
  name: string;
  parentId: number | null;
  children: MediaFolder[];
};

type MediaItem = {
  id: number;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  altText: string | null;
  title: string | null;
  caption: string | null;
  folderId: number | null;
  createdAt: string;
};

export default function MediaManager() {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Selection
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);

  // Modals
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [mediaPropertiesModal, setMediaPropertiesModal] = useState<MediaItem | null>(null);

  // Upload
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchFolders();
    fetchMedia(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFolders = async () => {
    const res = await fetch("/api/folders");
    const data = await res.json();
    if (data.success) setFolders(buildTree(data.folders));
  };

  const fetchMedia = async (folderId: number | null) => {
    setIsLoading(true);
    const res = await fetch(`/api/media?folderId=${folderId || 'null'}`);
    const data = await res.json();
    if (data.success) setMedia(data.media);
    setIsLoading(false);
  };

  const buildTree = (flatFolders: any[]): MediaFolder[] => {
    const tree: MediaFolder[] = [];
    const map = new Map();
    flatFolders.forEach(f => map.set(f.id, { ...f, children: [] }));
    flatFolders.forEach(f => {
      if (f.parentId) {
        const parent = map.get(f.parentId);
        if (parent) parent.children.push(map.get(f.id));
      } else {
        tree.push(map.get(f.id));
      }
    });
    return tree;
  };

  const handleSelectFolder = (id: number | null) => {
    setSelectedFolder(id);
    setSelectedMediaIds([]);
    fetchMedia(id);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFolderName, parentId: selectedFolder })
    });

    if (res.ok) {
      setNewFolderName("");
      setIsFolderModalOpen(false);
      fetchFolders();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append("files", file);
    });
    if (selectedFolder) {
      formData.append("folderId", selectedFolder.toString());
    }

    const res = await fetch("/api/media", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      fetchMedia(selectedFolder);
    }
    setIsUploading(false);
  };

  const toggleSelect = (id: number) => {
    setSelectedMediaIds(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Удалить ${selectedMediaIds.length} файлов?`)) return;

    for (const id of selectedMediaIds) {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
    }

    setSelectedMediaIds([]);
    fetchMedia(selectedFolder);
  };

  const handleUpdateProperties = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaPropertiesModal) return;

    const res = await fetch(`/api/media/${mediaPropertiesModal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: mediaPropertiesModal.title,
        altText: mediaPropertiesModal.altText,
        caption: mediaPropertiesModal.caption
      })
    });

    if (res.ok) {
      setMediaPropertiesModal(null);
      fetchMedia(selectedFolder);
    }
  };

  const FolderTree = ({ nodes, level = 0 }: { nodes: MediaFolder[], level?: number }) => {
    return (
      <ul className={`space-y-1 ${level > 0 ? "ml-4 border-l pl-2 border-gray-200" : ""}`}>
        {nodes.map(node => (
          <li key={node.id}>
            <div
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedFolder === node.id ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => handleSelectFolder(node.id)}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-blue-200'); }}
              onDragLeave={(e) => { e.currentTarget.classList.remove('bg-blue-200'); }}
              onDrop={async (e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('bg-blue-200');
                const draggedId = e.dataTransfer.getData("mediaId");
                if (draggedId) {
                   await fetch(`/api/media/${draggedId}`, {
                     method: "PUT",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ folderId: node.id })
                   });
                   fetchMedia(selectedFolder);
                }
              }}
            >
              <Folder size={16} className={selectedFolder === node.id ? "text-blue-600" : "text-gray-400"} />
              <span className="text-sm font-medium">{node.name}</span>
            </div>
            {node.children && node.children.length > 0 && (
              <FolderTree nodes={node.children} level={level + 1} />
            )}
          </li>
        ))}
      </ul>
    );
  };

  const renderFileIcon = (mimeType: string, url: string) => {
    if (mimeType.startsWith("image/")) {
      return <img src={url} alt="" className="w-full h-full object-cover" />;
    }
    if (mimeType.startsWith("video/")) {
      return <div className="flex items-center justify-center w-full h-full bg-indigo-50 text-indigo-400"><FileVideo size={32} /></div>;
    }
    return <div className="flex items-center justify-center w-full h-full bg-gray-50 text-gray-400"><FileText size={32} /></div>;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-xl font-bold text-gray-800">Медиабиблиотека</h1>
        <div className="flex items-center gap-3">
          {selectedMediaIds.length > 0 && (
             <button onClick={handleBulkDelete} className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium transition-colors">
               <Trash2 size={16} />
               Удалить ({selectedMediaIds.length})
             </button>
          )}
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm font-medium transition-colors shadow-sm">
            <Upload size={16} />
            {isUploading ? "Загрузка..." : "Загрузить"}
            <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-gray-50/50 p-4 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Папки</span>
            <button onClick={() => setIsFolderModalOpen(true)} className="p-1 hover:bg-gray-200 rounded text-gray-500">
              <Plus size={16} />
            </button>
          </div>

          <div
            className={`flex items-center gap-2 p-2 rounded cursor-pointer mb-2 transition-colors ${selectedFolder === null ? "bg-blue-100 text-blue-800 font-medium" : "hover:bg-gray-100 text-gray-700"}`}
            onClick={() => handleSelectFolder(null)}
          >
            <Folder size={16} className={selectedFolder === null ? "text-blue-600" : "text-gray-400"} />
            <span className="text-sm">Все файлы</span>
          </div>

          <FolderTree nodes={folders} />
        </div>

        {/* Main Grid */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <FileImage size={48} className="text-gray-300" />
              <p className="text-lg font-medium text-gray-500">Папка пуста</p>
              <p className="text-sm">Перетащите файлы сюда или используйте кнопку загрузки</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={`group relative aspect-square rounded-xl border-2 overflow-hidden bg-white transition-all ${selectedMediaIds.includes(item.id) ? "border-blue-500 shadow-md ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("mediaId", item.id.toString());
                  }}
                >
                  {renderFileIcon(item.mimeType, item.url)}

                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-black/40 transition-opacity ${selectedMediaIds.includes(item.id) ? "opacity-10" : "opacity-0 group-hover:opacity-100"}`}></div>

                  {/* Checkbox */}
                  <div
                    className={`absolute top-2 left-2 cursor-pointer p-1 rounded-full backdrop-blur-sm transition-all ${selectedMediaIds.includes(item.id) ? "bg-blue-500 text-white opacity-100" : "bg-white/50 text-white opacity-0 group-hover:opacity-100 hover:bg-white/80 hover:text-gray-800"}`}
                    onClick={() => toggleSelect(item.id)}
                  >
                    <CheckSquare size={18} className={selectedMediaIds.includes(item.id) ? "fill-current text-white" : ""} />
                  </div>

                  {/* Edit Button */}
                  <button
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-blue-600 transition-all backdrop-blur-sm shadow-sm"
                    onClick={() => setMediaPropertiesModal(item)}
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Title Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs truncate" title={item.filename}>{item.title || item.filename}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Новая папка</h3>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                autoFocus
                className="w-full px-4 py-2 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Имя папки..."
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Отмена</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Properties Modal */}
      {mediaPropertiesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
              {mediaPropertiesModal.mimeType.startsWith("image/") ? (
                <img src={mediaPropertiesModal.url} alt="" className="max-w-full max-h-full object-contain rounded drop-shadow-md" />
              ) : (
                <FileText size={64} className="text-gray-400" />
              )}
            </div>
            <div className="w-full md:w-1/2 p-6 flex flex-col relative overflow-y-auto">
              <button onClick={() => setMediaPropertiesModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-6">Свойства файла</h3>

              <form onSubmit={handleUpdateProperties} className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL файла</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={mediaPropertiesModal.url} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-500" />
                    <button type="button" onClick={() => navigator.clipboard.writeText(mediaPropertiesModal.url)} className="p-2 border rounded-lg text-gray-600 hover:bg-gray-50" title="Копировать URL">
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок (Title)</label>
                  <input type="text" value={mediaPropertiesModal.title || ""} onChange={e => setMediaPropertiesModal({...mediaPropertiesModal, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Альтернативный текст (Alt)</label>
                  <input type="text" value={mediaPropertiesModal.altText || ""} onChange={e => setMediaPropertiesModal({...mediaPropertiesModal, altText: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Подпись (Caption)</label>
                  <textarea rows={3} value={mediaPropertiesModal.caption || ""} onChange={e => setMediaPropertiesModal({...mediaPropertiesModal, caption: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>

                <div className="pt-4 mt-auto border-t border-gray-100 flex justify-end">
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                    <Save size={16} /> Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

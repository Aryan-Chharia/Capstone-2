import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import projectService from '../services/projectService';
import chatService from '../services/chatService';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchProjectDetails();
    fetchDatasets();
  }, [id]);

  useEffect(() => {
    if (project?.chats && project.chats.length > 0 && !activeChat) {
      loadChat(project.chats[0]._id);
    }
  }, [project]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchProjectDetails = async () => {
    try {
      const response = await projectService.getProject(id);
      setProject(response.data.project);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasets = async () => {
    try {
      const response = await projectService.listDatasets(id);
      setDatasets(response.data.datasets || []);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await chatService.getChatHistory(id, chatId);
      setActiveChat(chatId);
      setMessages(response.data.chat.messages || []);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() && selectedFiles.length === 0) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('projectId', id);
      if (activeChat) formData.append('chatId', activeChat);
      formData.append('content', messageInput);
      formData.append('selectedDatasets', JSON.stringify(selectedDatasets));

      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await chatService.sendMessage(formData);
      const newChatId = response.data.chatId;

      if (!activeChat) {
        setActiveChat(newChatId);
      }

      if (messageInput.trim()) {
        const aiResponse = await chatService.getAIReply({
          projectId: id,
          chatId: newChatId,
          content: messageInput,
        });

        await loadChat(newChatId);
      } else {
        await loadChat(newChatId);
      }

      setMessageInput('');
      setSelectedFiles([]);
      setSelectedDatasets([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleUploadDataset = async (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;

    try {
      const formData = new FormData();
      uploadFiles.forEach((file) => {
        formData.append('files', file);
      });

      await projectService.uploadDataset(id, formData);
      await fetchDatasets();
      setShowDatasetModal(false);
      setUploadFiles([]);
    } catch (error) {
      console.error('Error uploading dataset:', error);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 3) {
      alert('You can only upload up to 3 files');
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center text-gray-600">Project not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          {project.description && (
            <p className="mt-2 text-gray-600">{project.description}</p>
          )}
          {project.team && (
            <p className="mt-1 text-sm text-gray-500">Team: {project.team.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Datasets</h2>
                <button
                  onClick={() => setShowDatasetModal(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Upload
                </button>
              </div>
              <div className="space-y-2">
                {datasets.length === 0 ? (
                  <p className="text-sm text-gray-500">No datasets</p>
                ) : (
                  datasets.map((dataset) => (
                    <div
                      key={dataset._id}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        if (selectedDatasets.includes(dataset._id)) {
                          setSelectedDatasets(
                            selectedDatasets.filter((id) => id !== dataset._id)
                          );
                        } else {
                          setSelectedDatasets([...selectedDatasets, dataset._id]);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900 truncate">
                          {dataset.name}
                        </span>
                        {selectedDatasets.includes(dataset._id) && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow flex flex-col h-[600px]">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500">
                    Start a conversation...
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {message.content && (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl}
                            alt="Uploaded"
                            className="mt-2 rounded max-w-full"
                          />
                        )}
                        {message.confidenceScore && (
                          <p className="text-xs mt-2 opacity-75">
                            Confidence: {(message.confidenceScore * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                {selectedDatasets.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600">
                      Selected datasets: {selectedDatasets.length}
                    </p>
                  </div>
                )}
                {selectedFiles.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600">
                      Files: {selectedFiles.map((f) => f.name).join(', ')}
                    </p>
                  </div>
                )}
                <div className="flex space-x-2">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    accept="*/*"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    📎
                  </label>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {showDatasetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Upload Dataset
              </h2>
              <form onSubmit={handleUploadDataset}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setUploadFiles(Array.from(e.target.files))}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDatasetModal(false);
                      setUploadFiles([]);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetail;

"use client"
import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Folder } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CustomSession } from '@repo/types';
const Dashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const {data:session,status}=useSession();
  const [repls,setRepls]=useState([]);
  const router=useRouter();
  const environments = [
    { 
      id: 'nodejs', 
      name: 'Node.js', 
      icon: '⬢', 
      color: 'bg-green-50 border-green-200 hover:border-green-400',
      description: 'NodeJs : JavaScript runtime for server-side applications'
    },
    { 
      id: 'nextjs', 
      name: 'Next.js', 
      icon: '⚛️', 
      color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      description: 'Versatile language for building web applications'
    }
  ];

  useEffect(()=>{
    async function getYourRepls(){
       try {
          const repls=await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/repl/get`,{
            headers:{
              Authorization:`Bearer ${(session as CustomSession)?.accessToken}`
            }
          })
          if(repls.status >=400){
            throw new Error("Error in getting repls");
          }
          setRepls(repls.data.repls); 
       } catch (error) {
         console.log("Error in getting all the repls",error);
       }
    }
    if(session)getYourRepls();
  },[session])

  const getEnvIcon = (env:string) => {
    const envData = environments.find(e => e.id === env);
    return {icon: envData ? envData.icon : '📁', description: envData ? envData.description : 'Unknown environment'};
  };

  const filteredProjects = repls.filter(project => {
    const matchesSearch = project.replId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterBy === 'all' || project.language === filterBy;
    return matchesSearch && matchesFilter;
  });

  const handleCreateRepl = async(env:string) => {
   try {
      const response=await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/repl/create`,{
        language:selectedEnv
      },{
        headers:{
            Authorization:`Bearer ${(session as CustomSession)?.accessToken}`
        }
      })
      setShowCreateModal(false);
      setSelectedEnv(null);
   } catch (error) {
      console.log("Error in creating the repl");
   }

  };

  if(status === "loading"){
    return <div>Loading...</div>;
  }

  if(status === "unauthenticated"){
    router.push("/auth");
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Section - Search and Create */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">My Projects</h2>
            <p className="text-gray-600">Manage and create your coding environments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            New Repl
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all cursor-pointer"
            >
              <option value="all">All Environments</option>
              <option value="nodejs">Node.js</option>
              <option value="nextjs">Next.js</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-black hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getEnvIcon(project.language).icon}</div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:underline">{project.replId}</h3>
                    <span className="text-xs text-gray-500 capitalize">{project.env}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{getEnvIcon(project.language).description}</p>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No projects found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or create a new repl</p>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Create New Repl</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedEnv(null);
                }}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6">Choose your development environment</p>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => setSelectedEnv(env.id)}
                  className={`text-left p-6 border-2 rounded-lg transition-all ${
                    selectedEnv === env.id
                      ? 'border-black bg-gray-50 shadow-md'
                      : env.color
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{env.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-black mb-1">{env.name}</h3>
                      <p className="text-sm text-gray-600">{env.description}</p>
                    </div>
                    {selectedEnv === env.id && (
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedEnv(null);
                }}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-black font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateRepl(selectedEnv)}
                disabled={!selectedEnv}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all ${
                  selectedEnv
                    ? 'bg-black text-white hover:bg-gray-900 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Repl
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
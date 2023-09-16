import React, { useState } from 'react';
import axios from 'axios';

function Home() {
  const URL="https://3001-narendra002-dataseo-xwr8sbc6siy.ws-us104.gitpod.io";
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(`${URL}/api/start`, { url });
      const taskId = response.data.taskId[0].id;
  
     
      setTimeout( async () => {
        const resourcesResponse = await axios.post(`${URL}/api/load`, { taskId });
  
        // Add a setTimeout with a delay of 10000ms
        console.log(resourcesResponse.data);
        setResources(resourcesResponse.data.tasks[0].result[0].items);
        
        setLoading(false);
      }, 10000);
    } catch (error) {
      console.error(error);
      setResources([]);
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="md:w-1/2 lg:w-2/3 xl:w-1/2 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">SEO Tool</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            placeholder="Enter URL"
            className="w-full border border-gray-300 rounded py-2 px-3 mb-2"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
          >
            {loading ? 'Checking...' : 'Check SEO'}
          </button>
        </form>

        {resources.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Loaded Resources:</h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Size (bytes)</th>
                    <th className="px-4 py-2">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource, index) => (
                    <tr key={index} className={(index % 2 === 0 ? 'bg-gray-100' : '')}>
                      <td className="border px-4 py-2">{resource.resource_type}</td>
                      <td className="border px-4 py-2">{resource.size}</td>
                      <td className="border px-4 py-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {resource.url}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

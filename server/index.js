// Import dotenv and load environment variables from .env
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
const corsOptions = {
  origin: '*',
  methods: 'POST',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};

app.use(cors(corsOptions));

// Route to trigger the DataForSEO API analysis
app.post('/api/start', async (req, res) => {
  const { url } = req.body;

  // Use environment variables for API credentials
  const dataForSeoUsername = process.env.DATAFORSEO_USERNAME;
  const dataForSeoPassword = process.env.DATAFORSEO_PASSWORD;

  try {
    // Prepare the payload for the DataForSEO API
    const customJsCode = `
      // This code will be executed in the browser
      var pageTitle = document.title;
      pageTitle;
    `;

    const postArray = [
      {
        target: url,
        max_crawl_pages: 1,
        load_resources: true,
        enable_javascript: true,
        custom_js: customJsCode,
        pingback_url: "https://data-seo-vk8o.vercel.app",
        tag: 'some_string_123',
      },
    ];

    // Make a POST request to start the SEO analysis
    const response = await axios.post('https://api.dataforseo.com/v3/on_page/task_post', postArray, {
      auth: {
        username: dataForSeoUsername,
        password: dataForSeoPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the taskId as a response
    res.json({ taskId: response.data.tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start SEO analysis.' });
  }
});

// Route to retrieve resources using taskId
app.post('/api/load', async (req, res) => {
  const { taskId } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: 'Task ID is missing.' });
  }

  // Use environment variables for API credentials
  const dataForSeoUsername = process.env.DATAFORSEO_USERNAME;
  const dataForSeoPassword = process.env.DATAFORSEO_PASSWORD;

  try {
    // Prepare the payload for the DataForSEO API to retrieve resources
    const postArray = [
      {
        id: taskId,
        filters: [
          ["resource_type", "=", "image"],
          "or",
          ["resource_type", "=", "script"],
          "and",
          ["size", ">", 100000]
        ],
        order_by: ["size,desc"],
        limit: 10,
      },
    ];

    // Make a POST request to retrieve resources
    const response = await axios.post('https://api.dataforseo.com/v3/on_page/resources', postArray, {
      auth: {
        username: dataForSeoUsername,
        password: dataForSeoPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Get the resource data from the response
    const resourceData = response.data;

    // Return the resource data
    res.json(resourceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve resources.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');

// Initialize the app
const app = express();
const port = 3000;

// Use body-parser for JSON parsing
app.use(bodyParser.json());

// Endpoint to handle ML model predictions
app.post('/predict', (req, res) => {
    const inputData = req.body.input; // Assumes input data is in the JSON body as { "input": [1, 2, 3, ...] }
    
    // Options for PythonShell to send data to Python script
    let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: './scripts', // Adjust this path to where your Python script is
        args: [JSON.stringify(inputData)]
    };

    // Run Python script and handle output
    PythonShell.run('predict.py', options, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Parse the result from Python and send as JSON response
        try {
            const prediction = JSON.parse(results[0]);
            res.json({ prediction });
        } catch (parseError) {
            res.status(500).json({ error: 'Failed to parse prediction output.' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

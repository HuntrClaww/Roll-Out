const { Client } = require('@modelcontextprotocol/client');
const { spawn } = require('child_process');

// Start the MCP filesystem server
const serverProcess = spawn('cmd', [
  '/c',
  'npx',
  '-y',
  '@modelcontextprotocol/server-filesystem',
  'C:\\Users\\HuntrClaww\\OneDrive\\Documents\\VS Code Projects\\Roll Out - Roll Into The Extreme Wonderland'
], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Create a client connected to the server
const client = new Client({
  name: 'demo-client',
  version: '1.0.0'
});

// Error handling
serverProcess.stderr.on('data', (data) => {
  console.error('Server stderr:', data.toString());
});

// Main async function
async function main() {
  try {
    // Connect to the server
    await client.connect(serverProcess);
    console.log('Connected to MCP filesystem server');

    // List allowed directories
    console.log('\nListing allowed directories...');
    const result = await client.callTool('list_allowed_directories', {});
    console.log('Allowed directories:', JSON.stringify(result, null, 2));

    // List directory contents
    console.log('\nListing current directory...');
    const listResult = await client.callTool('list_directory', {
      path: 'C:\\Users\\HuntrClaww\\OneDrive\\Documents\\VS Code Projects\\Roll Out - Roll Into The Extreme Wonderland'
    });
    console.log('Directory contents:', JSON.stringify(listResult, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Clean up
    await client.close();
    serverProcess.kill();
    process.exit(0);
  }
}

main();

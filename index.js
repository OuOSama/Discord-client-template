const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the project path from command line arguments or default to 'my-discord-bot'
const projectPath = process.argv[2] || path.join(process.cwd(), 'my-discord-bot');
const projectDir = path.resolve(projectPath); // Resolve to an absolute path
const sourceDir = __dirname; // This is the directory where your template files are located

// Check if the project directory already exists
if (fs.existsSync(projectDir)) {
  console.error(`Error: Project directory "${projectDir}" already exists.`);
  process.exit(1);
}

// Function to copy files from source to destination
function copyFiles(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true }); // Create destination directory if it doesn't exist

  fs.readdirSync(srcDir).forEach((file) => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    // Skip node_modules and the project folder itself
    if (file === 'node_modules' || file === path.basename(projectDir)) return;

    // If the item is a directory, copy its contents recursively
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFiles(srcPath, destPath);
    } else {
      // Otherwise, copy the file
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Create the project directory
fs.mkdirSync(projectDir);

// Copy the template files to the project directory
copyFiles(sourceDir, projectDir);

// Update the package.json file
const packageJsonPath = path.join(projectDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.name = path.basename(projectDir); // Set the name based on the project path
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { cwd: projectDir, stdio: 'inherit' });

console.log(`Project "${path.basename(projectDir)}" created successfully!`);
console.log(`Run 'cd ${path.basename(projectDir)}' to access your new project.`);

#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const projectName = process.argv[2] || 'my-discord-bot' // Default project name
const projectDir = path.join(process.cwd(), projectName)
const sourceDir = __dirname // Source directory (current folder)

// Check if the project directory already exists
if (fs.existsSync(projectDir)) {
  console.error(`Error: Project directory "${projectName}" already exists.`)
  process.exit(1)
}

// Helper function to copy files and folders recursively
function copyFiles(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })

  fs.readdirSync(srcDir).forEach(file => {
    const srcPath = path.join(srcDir, file)
    const destPath = path.join(destDir, file)

    // Skip node_modules
    if (file === 'node_modules') return

    if (fs.lstatSync(srcPath).isDirectory()) {
      // Recursively copy folders
      copyFiles(srcPath, destPath)
    } else {
      // Copy individual files
      fs.copyFileSync(srcPath, destPath)
    }
  })
}

// Create project directory
fs.mkdirSync(projectDir)

// Copy files and folders from the source directory to the new project directory
copyFiles(sourceDir, projectDir)

// Run npm install in the new project directory
console.log('Installing dependencies...')
execSync('npm install', { cwd: projectDir, stdio: 'inherit' })

console.log(`Project "${projectName}" created successfully!`)
console.log(`Run 'cd ${projectName}' to access your new project.`)

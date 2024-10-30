const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const projectName = process.argv[2] || 'my-discord-bot'
const projectDir = path.join(process.cwd(), projectName)
const sourceDir = __dirname

if (fs.existsSync(projectDir)) {
  console.error(`Error: Project directory "${projectName}" already exists.`);
  process.exit(1);
}


function copyFiles(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })

  fs.readdirSync(srcDir).forEach((file) => {
    const srcPath = path.join(srcDir, file)
    const destPath = path.join(destDir, file)

    if (file === 'node_modules' || file === projectName) return

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFiles(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  })
}

fs.mkdirSync(projectDir)

copyFiles(sourceDir, projectDir)

const packageJsonPath = path.join(projectDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
packageJson.name = projectName
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')

console.log('Installing dependencies...')
execSync('npm install', { cwd: projectDir, stdio: 'inherit' })

console.log(`Project "${projectName}" created successfully!`);
console.log(`Run 'cd ${projectName}' to access your new project.`);

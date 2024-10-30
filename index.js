#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2] || 'my-discord-bot'; // ชื่อโปรเจกต์เริ่มต้น
const projectDir = path.join(process.cwd(), projectName);
const sourceDir = __dirname; // ไดเรกทอรีต้นทาง (โฟลเดอร์ปัจจุบัน)

// ตรวจสอบว่าไดเรกทอรีโปรเจกต์มีอยู่แล้วหรือไม่
if (fs.existsSync(projectDir)) {
  console.error(`Error: Project directory "${projectName}" already exists.`);
  process.exit(1);
}

// ฟังก์ชันช่วยในการคัดลอกไฟล์และโฟลเดอร์ โดยไม่รวม node_modules และโฟลเดอร์โปรเจกต์
function copyFiles(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });

  fs.readdirSync(srcDir).forEach((file) => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    // ข้าม node_modules และโฟลเดอร์โปรเจกต์เอง
    if (file === 'node_modules' || file === projectName) return;

    if (fs.lstatSync(srcPath).isDirectory()) {
      // คัดลอกโฟลเดอร์อย่างซ้ำๆ
      copyFiles(srcPath, destPath);
    } else {
      // คัดลอกไฟล์แต่ละไฟล์
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// สร้างไดเรกทอรีโปรเจกต์
fs.mkdirSync(projectDir);

// คัดลอกไฟล์และโฟลเดอร์จากไดเรกทอรีต้นทางไปยังไดเรกทอรีโปรเจกต์ใหม่
copyFiles(sourceDir, projectDir);

// อ่านและปรับปรุง package.json
const packageJsonPath = path.join(projectDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.name = projectName; // เปลี่ยนชื่อเป็นชื่อโปรเจกต์
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

// รัน npm install ในไดเรกทอรีโปรเจกต์ใหม่
console.log('Installing dependencies...');
execSync('npm install', { cwd: projectDir, stdio: 'inherit' });

console.log(`Project "${projectName}" created successfully!`);
console.log(`Run 'cd ${projectName}' to access your new project.`);

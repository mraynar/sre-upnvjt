const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function cleanCommentsInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            cleanCommentsInDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            cleanFile(fullPath);
        }
    }
}

function cleanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    let changed = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Remove full-line comments unless they contain "section"
        if (trimmed.startsWith('//')) {
            if (trimmed.toLowerCase().includes('section')) {
                newLines.push(line);
            } else {
                changed = true;
            }
        } 
        // Handle inline comments
        else if (line.includes('//') && !line.includes('http://') && !line.includes('https://')) {
            const commentIndex = line.lastIndexOf('//');
            // Basic check to see if it's inside quotes is hard, but we can assume most // are comments.
            const commentPart = line.substring(commentIndex);
            if (commentPart.toLowerCase().includes('section')) {
                newLines.push(line);
            } else {
                newLines.push(line.substring(0, commentIndex).trimEnd());
                changed = true;
            }
        } 
        else {
            newLines.push(line);
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        console.log('Cleaned:', filePath);
    }
}

cleanCommentsInDir(srcDir);
console.log('Done cleaning comments in src directory.');

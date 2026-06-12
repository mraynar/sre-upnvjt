const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', '(dashboard)');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile() && filePath.endsWith('.js')) {
            callback(filePath);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

const replacements = [
    // Ensure we don't replace if already prefixed with dark:
    // text-white
    { regex: /(?<!dark:)text-white(?![\/\w\-])/g, replace: 'text-gray-900 dark:text-white' },
    // text-white/50
    { regex: /(?<!dark:)text-white\/([0-9]+)/g, replace: 'text-gray-500 dark:text-white/$1' },
    
    // hover:text-white
    { regex: /(?<!dark:)hover:text-white(?![\/\w\-])/g, replace: 'hover:text-gray-900 dark:hover:text-white' },
    
    // bg-white/10
    { regex: /(?<!dark:)(?<!hover:)bg-white\/([0-9]+)/g, replace: 'bg-white dark:bg-white/$1 shadow-sm dark:shadow-none' },
    
    // hover:bg-white/10
    { regex: /(?<!dark:)hover:bg-white\/([0-9]+)/g, replace: 'hover:bg-gray-50 dark:hover:bg-white/$1' },
    
    // Solid dark backgrounds
    { regex: /(?<!dark:)bg-\[\#050e0a\]/g, replace: 'bg-white dark:bg-[#050e0a]' },
    { regex: /(?<!dark:)bg-\[\#020806\]/g, replace: 'bg-gray-50 dark:bg-[#020806]' },
    { regex: /(?<!dark:)bg-\[\#0a110e\]/g, replace: 'bg-white dark:bg-[#0a110e]' },
    { regex: /(?<!dark:)bg-\[\#112a20\]/g, replace: 'bg-white dark:bg-[#112a20]' },
    
    // border-white/10
    { regex: /(?<!dark:)border-white\/([0-9]+)/g, replace: 'border-gray-200 dark:border-white/$1' },
    
    // ring-white/10
    { regex: /(?<!dark:)ring-white\/([0-9]+)/g, replace: 'ring-gray-200 dark:ring-white/$1' },
];

walkSync(directoryPath, function(filePath) {
    if (filePath.includes('layout.js') || filePath.includes('DashboardClient.js')) {
        return; // skip already manually refactored files
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replacements.forEach(r => {
        content = content.replace(r.regex, r.replace);
    });
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
});

import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let updatedCount = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    content = content.replace(/\/assets\/galeri/g, '/assets/gallery')
                     .replace(/\/assets\/karakter/g, '/assets/illustrations')
                     .replace(/\/assets\/katalog/g, '/assets/catalog')
                     .replace(/\/assets\/pra-event/g, '/assets/pre-event')
                     .replace(/\/assets\/sponsor\//g, '/assets/sponsors/')
                     .replace(/\/assets\/sponsor"/g, '/assets/sponsors"')
                     .replace(/\/assets\/sponsor'/g, "/assets/sponsors'");
                     
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        updatedCount++;
    }
});
console.log('Total files updated:', updatedCount);

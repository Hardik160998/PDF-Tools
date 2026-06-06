const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'HomeClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix skeletonCount
content = content.replace('const skeletonCount = 8;', 'const skeletonCount = 36;');

// Remove !mounted checks for static sections
// 1. TAGLINE
content = content.replace(
    /\{\!mounted \? \([\s\S]*?<Sh className="h-12 w-3\/4" \/>[\s\S]*?\) \: \([\s\S]*?(<section className="py-20 text-center bg-white dark:bg-slate-900">[\s\S]*?<\/section>)[\s\S]*?\)\}/,
    '$1'
);

// 2. CREATE THE PERFECT DOCUMENT
content = content.replace(
    /\{\!mounted \? \([\s\S]*?<section className="py-20 bg-slate-50 dark:bg-slate-800\/40">[\s\S]*?<FeatureSectionShimmer \/>[\s\S]*?\) \: \([\s\S]*?(<section className="py-20 bg-slate-50 dark:bg-slate-800\/40">[\s\S]*?<div className="container mx-auto px-4">[\s\S]*?<div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto">[\s\S]*?<\/section>)[\s\S]*?\)\}/,
    '$1'
);

// 3. DIGITAL SIGNATURES
content = content.replace(
    /\{\!mounted \? \([\s\S]*?<section className="py-16 bg-white dark:bg-slate-900">[\s\S]*?<FeatureSectionShimmer reverse \/>[\s\S]*?\) \: \([\s\S]*?(<section className="py-16 bg-white dark:bg-slate-900">[\s\S]*?<div className="container mx-auto px-4">[\s\S]*?<div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-6xl mx-auto">[\s\S]*?<\/section>)[\s\S]*?\)\}/,
    '$1'
);

// 4. WORK DIRECTLY ON YOUR FILES
content = content.replace(
    /\{\!mounted \? \([\s\S]*?<section className="py-16 bg-slate-50 dark:bg-slate-800\/40">[\s\S]*?<FeatureSectionShimmer \/>[\s\S]*?\) \: \([\s\S]*?(<section className="py-16 bg-slate-50 dark:bg-slate-800\/40">[\s\S]*?<div className="container mx-auto px-4">[\s\S]*?<div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">[\s\S]*?<\/section>)[\s\S]*?\)\}/,
    '$1'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed HomeClient.tsx layout shift issues.');

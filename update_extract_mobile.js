const fs = require('fs');
let code = fs.readFileSync('src/components/tools/ExtractPages.tsx', 'utf8');

// 1. Ensure useState is tracking showSettings
if (!code.includes('const [showSettings, setShowSettings] = useState(false);')) {
    code = code.replace(
        'const [result, setResult] = useState<{ url: string, count: number } | null>(null);',
        'const [result, setResult] = useState<{ url: string, count: number } | null>(null);\n  const [showSettings, setShowSettings] = useState(false);'
    );
}

// 2. Add ChevronDown and Settings to imports if missing
if (!code.includes('ChevronDown')) {
    code = code.replace(
        'import { Upload, Download, Loader2, X, FileText, Settings as SettingsIcon, AlertCircle, Plus, Zap, Shield, Sparkles } from \'lucide-react\';',
        'import { Upload, Download, Loader2, X, FileText, Settings as SettingsIcon, AlertCircle, Plus, Zap, Shield, Sparkles, ChevronDown } from \'lucide-react\';'
    );
}
// Note: ExtractPages uses `Settings as SettingsIcon`

// 3. Replace the sidebar wrapper inner content
const targetRegex = /<div className="p-6">\s*<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-tighter text-left">Extraction Settings<\/h3>/;
const replacement = `<button onClick={() => setShowSettings(!showSettings)} className="w-full flex lg:hidden items-center justify-between p-5 font-medium text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700">
  <span className="flex items-center gap-2"><SettingsIcon size={20} style={{ color: ACCENT }} /> Settings</span>
  <ChevronDown className={\`transition-transform duration-300 \${showSettings ? 'rotate-180' : ''}\`} size={20} />
  </button>
  <div className={\`\${showSettings ? 'block' : 'hidden'} lg:block p-6\`}>
  <h3 className="hidden lg:block text-xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-tighter text-left">Extraction Settings</h3>`;

code = code.replace(targetRegex, replacement);

// 4. Also fix the closing div of the sidebar if needed. But wait, we just wrapped the p-6 div's opening tag. 
// No need to add another closing div since we just replaced `<div className="p-6">` with `<div className="... p-6">`.

fs.writeFileSync('src/components/tools/ExtractPages.tsx', code);

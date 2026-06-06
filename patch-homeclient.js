const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'HomeClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
    'export default function HomeClient() {',
    'export default function HomeClient({ initialTools, initialCategories }: { initialTools?: any[], initialCategories?: any[] }) {'
);

content = content.replace(
    'const { data: allTools, isLoading: toolsLoading } = useAllTools();',
    'const { data: allTools, isLoading: toolsLoading } = useAllTools(initialTools);'
);

content = content.replace(
    'const { data: rawCategories } = useDbCategories();',
    'const { data: rawCategories } = useDbCategories(initialCategories);'
);

content = content.replace(
    'const showGridSkeleton = !mounted || (!cachedToolsExist && toolsLoading && !allTools);',
    'const showGridSkeleton = (!initialTools && !mounted) || (!cachedToolsExist && toolsLoading && !allTools);'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched HomeClient.tsx for SSR initial data hydration.');

import ToolClient from './ToolClient';

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ToolClient id={id} />;
}

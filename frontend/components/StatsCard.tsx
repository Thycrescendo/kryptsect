export default function StatsCard({ label, value, change }: { label: string; value: string; change?: string }) {
  const positive = !change?.startsWith('-');
  return <div className="glass rounded-2xl p-5 shadow-glow"><p className="text-sm text-gray-400">{label}</p><h3 className="mt-2 text-2xl font-bold">{value}</h3>{change && <p className={positive ? 'mt-2 text-sm text-krypt-green' : 'mt-2 text-sm text-krypt-red'}>{change}</p>}</div>;
}

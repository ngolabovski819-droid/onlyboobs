interface Stat {
  value: string;
  label: string;
}

interface Props {
  stats?: Stat[];
}

const DEFAULT_STATS: Stat[] = [
  { value: "Worldwide", label: "Creators" },
  { value: "All sizes", label: "All shapes" },
  { value: "18+", label: "Adults only" },
  { value: "Free", label: "To Browse" },
];

export default function StatsBar({ stats = DEFAULT_STATS }: Props) {
  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div key={s.label} className="stat-item">
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';

const MODES = [
  { id: 'casual', label: 'Casual', icon: '🎮', color: '#ec4899', disabled: false },
  { id: 'pro', label: 'Pro (TBD)', icon: '🔧', color: '#2563eb', disabled: true },
  { id: 'data', label: 'Data (TBD)', icon: '📊', color: '#14b8a6', disabled: true },
  { id: 'lab', label: 'Lab', icon: '🧪', color: '#f59e0b', disabled: false },
] as const;

export function ModeSwitcher(): JSX.Element {
  const location = useLocation();
  return (
    <nav className="mode-switcher">
      {MODES.map((mode) => {
        const active = location.pathname.startsWith(`/${mode.id}`);
        if (mode.disabled) {
          return (
            <span
              key={mode.id}
              className="mode-link mode-link--disabled"
              title="TBD"
              style={{ opacity: 0.65 }}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </span>
          );
        }
        return (
          <Link
            key={mode.id}
            to={`/${mode.id}`}
            className="mode-link"
            style={{
              borderColor: active ? mode.color : 'transparent',
              background: active ? `${mode.color}22` : 'transparent',
            }}
          >
            <span>{mode.icon}</span>
            <span>{mode.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

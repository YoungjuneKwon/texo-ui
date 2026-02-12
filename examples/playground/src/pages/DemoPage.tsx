import { Link, Navigate, useParams } from 'react-router-dom';
import { DemoShell } from '../components/DemoShell';
import { findScenario, scenariosByCategory } from '../scenarios';

export function DemoPage(): JSX.Element {
  const params = useParams<{ category: 'casual' | 'pro' | 'data'; demoId: string }>();
  const category = (params.category ?? 'casual') as 'casual' | 'pro' | 'data';
  const scenario = findScenario(category, params.demoId ?? '');
  if (!scenario) {
    return <Navigate to={`/${category}`} replace />;
  }

  const list = scenariosByCategory(category);
  return (
    <section>
      <div className="demo-header">
        <h2>{scenario.name}</h2>
        <div className="demo-links">
          {list.map((entry) => (
            <Link
              key={entry.id}
              to={`/${entry.category}/${entry.id}`}
              className={entry.id === scenario.id ? 'active' : ''}
            >
              {entry.name}
            </Link>
          ))}
        </div>
      </div>
      <DemoShell scenario={scenario} />
    </section>
  );
}

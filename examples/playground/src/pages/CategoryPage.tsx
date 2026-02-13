import { Link, useParams } from 'react-router-dom';
import { scenariosByCategory } from '../scenarios';

export function CategoryPage(): JSX.Element {
  const params = useParams<{ category: 'casual' | 'pro' | 'data' }>();
  const category = (params.category ?? 'casual') as 'casual' | 'pro' | 'data';

  if (category === 'pro' || category === 'data') {
    return (
      <section>
        <h2>{category.toUpperCase()} (TBD)</h2>
        <p className="muted">This area is reserved for future demos.</p>
      </section>
    );
  }

  const scenarios = scenariosByCategory(category);

  return (
    <section>
      <h2>{category.toUpperCase()} Demos</h2>
      <div className="demo-grid">
        {scenarios.map((scenario) => (
          <Link key={scenario.id} to={`/${scenario.category}/${scenario.id}`} className="demo-card">
            <h3>{scenario.name}</h3>
            <p>{scenario.systemPrompt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

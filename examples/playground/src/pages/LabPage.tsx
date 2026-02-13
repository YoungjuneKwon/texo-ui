import { createRegistry, TexoRenderer, type TexoAction } from '@texo-ui/react';
import {
  BUILTIN_COMPONENT_CATALOG,
  createBuiltInComponents,
  type CatalogComponent,
  type CatalogProp,
} from '@texo-ui/kit';
import { validateIntentPlan, type RecoveryEvent } from '@texo-ui/core';
import { useMemo, useRef, useState } from 'react';
import { compileIntentPlanToTexo } from '../utils/intent-compiler';
import { normalizeIntentPlan } from '../utils/normalize-intent-plan';
import { extractJSONObject } from '../utils/plan-json';
import { plannerProviders, type PlannerProviderId } from '../utils/planner-providers';

function streamText(
  content: string,
  setContent: (updater: (prev: string) => string) => void,
  onEnd: () => void,
): void {
  let index = 0;
  const chunkSize = 8;
  const tick = (): void => {
    if (index >= content.length) {
      onEnd();
      return;
    }
    const next = content.slice(index, index + chunkSize);
    index += chunkSize;
    setContent((prev) => prev + next);
    globalThis.setTimeout(tick, 20);
  };
  tick();
}

export function LabPage(): JSX.Element {
  const registry = useMemo(() => createRegistry(createBuiltInComponents()), []);
  const abortRef = useRef<AbortController | null>(null);

  const [providerId, setProviderId] = useState<PlannerProviderId>('mock');
  const [model, setModel] = useState(plannerProviders.mock.defaultModel);
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [prompt, setPrompt] = useState('Create a compact analytics dashboard with a filter form.');
  const [streamTextValue, setStreamTextValue] = useState('');
  const [planDraftText, setPlanDraftText] = useState('');
  const [planJson, setPlanJson] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [actions, setActions] = useState<TexoAction[]>([]);
  const [recoveryEvents, setRecoveryEvents] = useState<RecoveryEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const provider = plannerProviders[providerId];

  const catalogGuide = useMemo(
    () =>
      BUILTIN_COMPONENT_CATALOG.map(
        (item: CatalogComponent) =>
          `${item.name}: ${item.summary} | props: ${item.props.map((prop: CatalogProp) => prop.name).join(', ')}`,
      ).join('\n'),
    [],
  );

  const onProviderChange = (nextProviderId: PlannerProviderId): void => {
    setProviderId(nextProviderId);
    setModel(plannerProviders[nextProviderId].defaultModel);
  };

  const cancel = (): void => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
  };

  const run = async (): Promise<void> => {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setErrors([]);
    setActions([]);
    setRecoveryEvents([]);
    setStreamTextValue('');
    setPlanDraftText('');
    setPlanJson('');
    setIsGenerating(true);

    try {
      if (provider.requiresApiKey && !apiKey.trim()) {
        setErrors([`${provider.label} provider requires an API key.`]);
        return;
      }

      const planText = await provider.generatePlanText({
        prompt,
        model: model.trim() || provider.defaultModel,
        apiKey: apiKey.trim() || undefined,
        baseUrl: baseUrl.trim() || undefined,
        signal: abortController.signal,
        catalogGuide,
        onText: (chunk) => {
          setPlanDraftText((prev) => prev + chunk);
        },
      });

      const extracted = extractJSONObject(planText);
      if (!extracted) {
        setErrors(['Planner output did not contain a valid JSON object.']);
        return;
      }

      const parsed = JSON.parse(extracted) as unknown;
      const normalized = normalizeIntentPlan(parsed);
      const validated = validateIntentPlan(normalized);
      setPlanJson(JSON.stringify(normalized, null, 2));
      if (!validated.ok || !validated.value) {
        setErrors(validated.errors);
        return;
      }

      const compiled = compileIntentPlanToTexo(validated.value);
      streamText(compiled, setStreamTextValue, () => {});
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === 'AbortError'
          ? 'Generation cancelled.'
          : error instanceof Error
            ? error.message
            : 'Unknown planner error';
      setErrors([message]);
    } finally {
      if (abortRef.current === abortController) {
        abortRef.current = null;
      }
      setIsGenerating(false);
    }
  };

  return (
    <section className="lab-page">
      <header className="lab-header">
        <h2>Generative Lab</h2>
        <p>Prompt -&gt; IntentPlan -&gt; Directive stream -&gt; Built-in UI rendering</p>
      </header>

      <div className="lab-grid">
        <article className="panel">
          <h3>Prompt</h3>
          <div className="lab-controls">
            <label>
              Provider
              <select
                className="lab-select"
                value={providerId}
                onChange={(e) => onProviderChange(e.target.value as PlannerProviderId)}
              >
                {Object.values(plannerProviders).map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Model
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="lab-input"
                placeholder={provider.defaultModel}
              />
            </label>
            <label>
              Base URL (optional)
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="lab-input"
                placeholder={
                  provider.id === 'anthropic'
                    ? 'https://api.anthropic.com/v1'
                    : 'https://api.openai.com/v1'
                }
              />
            </label>
            <label>
              API key {provider.requiresApiKey ? '(required)' : '(optional)'}
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="lab-input"
                placeholder={provider.id === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
              />
            </label>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="lab-input"
            rows={5}
          />
          <div className="lab-actions">
            <button
              type="button"
              className="cta"
              onClick={() => void run()}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Plan'}
            </button>
            <button type="button" className="lab-cancel" onClick={cancel} disabled={!isGenerating}>
              Cancel
            </button>
          </div>
          {errors.length > 0 ? (
            <pre className="chat-box">{errors.map((error) => `- ${error}`).join('\n')}</pre>
          ) : null}
        </article>

        <article className="panel">
          <h3>Built-in Catalog</h3>
          <ul className="lab-catalog">
            {BUILTIN_COMPONENT_CATALOG.map((item: CatalogComponent) => (
              <li key={item.name}>
                <strong>{item.name}</strong>
                <p>{item.summary}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h3>Planner Stream</h3>
          <pre className="chat-box">{planDraftText || 'Planner tokens stream here.'}</pre>
        </article>

        <article className="panel">
          <h3>IntentPlan JSON</h3>
          <pre className="chat-box">{planJson || 'Plan appears here after generation.'}</pre>
        </article>

        <article className="panel">
          <h3>Texo Stream</h3>
          <pre className="chat-box">{streamTextValue || 'Compiled directives stream here.'}</pre>
        </article>

        <article className="panel">
          <h3>Rendered UI</h3>
          <TexoRenderer
            content={streamTextValue}
            registry={registry}
            onAction={(action) => setActions((prev) => [...prev, action])}
            onError={(event) => setRecoveryEvents((prev) => [...prev, event])}
          />
        </article>

        <article className="panel">
          <h3>Interaction/Recovery Log</h3>
          <pre className="chat-box">
            {JSON.stringify({ actions, recoveryEvents }, null, 2) || 'No events yet.'}
          </pre>
        </article>
      </div>
    </section>
  );
}

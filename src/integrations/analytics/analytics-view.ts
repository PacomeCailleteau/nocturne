import { createElement as h, useState, type ChangeEvent, type ReactNode } from 'react';
import type { Analysis, AnalyticsCase, AnalyticsModel, TimelineDatum } from './analytics-types';

function year(value: number, model: AnalyticsModel): string {
  return value < 0
    ? `${Math.abs(value)} ${model.copy.bce}`
    : value < 1000
      ? `${value} ${model.copy.ce}`
      : String(value);
}

function interval(row: TimelineDatum, model: AnalyticsModel): string {
  if (row.begin === null || row.end === null) return model.copy.unknown;
  return row.begin === row.end
    ? year(row.begin, model)
    : `${year(row.begin, model)} – ${year(row.end, model)}`;
}

function table(
  headers: readonly string[],
  rows: readonly (readonly ReactNode[])[],
  caption: string,
): ReactNode {
  return h(
    'div',
    { className: 'table-wrap' },
    h(
      'table',
      null,
      h('caption', null, caption),
      h(
        'thead',
        null,
        h(
          'tr',
          null,
          ...headers.map((label, index) => h('th', { key: index, scope: 'col' }, label)),
        ),
      ),
      h(
        'tbody',
        null,
        ...rows.map((cells, index) =>
          h(
            'tr',
            { key: index },
            ...cells.map((cell, column) =>
              column === 0
                ? h('th', { key: column, scope: 'row' }, cell)
                : h('td', { key: column }, cell),
            ),
          ),
        ),
      ),
    ),
  );
}

function graphic(label: string, height: number, children: ReactNode[]): ReactNode {
  return h(
    'svg',
    { className: 'chart', viewBox: `0 0 640 ${height}`, role: 'img', 'aria-label': label },
    h('title', null, label),
    ...children,
  );
}

function timelineChart(rows: readonly TimelineDatum[], model: AnalyticsModel): ReactNode {
  const dated = rows.filter((row) => row.begin !== null && row.end !== null);
  if (!dated.length) return h('p', { className: 'empty' }, model.copy.empty);
  const min = Math.min(...dated.map((row) => row.begin!));
  const max = Math.max(...dated.map((row) => row.end!));
  const x = (value: number): number => 62 + ((value - min) / (max - min || 1)) * 516;
  const height = rows.length * 58 + 55;
  const marks: ReactNode[] = [
    h('line', {
      key: 'axis',
      className: 'grid',
      x1: 62,
      x2: 578,
      y1: height - 35,
      y2: height - 35,
    }),
    h('text', { key: 'min', x: 62, y: height - 8 }, year(min, model)),
    h('text', { key: 'max', x: 578, y: height - 8, textAnchor: 'end' }, year(max, model)),
  ];
  rows.forEach((row, index) => {
    const y = index * 58 + 24;
    marks.push(h('text', { key: `n${index}`, x: 4, y: y + 5 }, String(index + 1).padStart(2, '0')));
    if (row.begin !== null && row.end !== null) {
      marks.push(
        h(
          'g',
          { key: index },
          h('title', null, `${row.title} · ${interval(row, model)}`),
          h('line', { className: 'grid', x1: 62, x2: 578, y1: y, y2: y }),
          h('line', {
            className: 'mark',
            x1: x(row.begin),
            x2: x(row.end),
            y1: y,
            y2: y,
            strokeWidth: 7,
            strokeLinecap: 'round',
          }),
          h('circle', { className: 'mark', cx: x(row.begin), cy: y, r: 5 }),
          h('circle', { className: 'mark', cx: x(row.end), cy: y, r: 5 }),
        ),
      );
    }
  });
  return graphic(`${model.copy.timeline} · ${rows.length} ${model.copy.works}`, height, marks);
}

function candidateChart(item: AnalyticsCase, model: AnalyticsModel): ReactNode {
  const points = item.candidates;
  const max = points[0].count || 1;
  const x = (index: number): number => 64 + index * (500 / Math.max(1, points.length - 1));
  const y = (count: number): number => 180 - (count / max) * 140;
  return graphic(
    `${model.copy.candidates} · ${points.map((point) => point.count).join(' → ')}`,
    235,
    [
      h('line', { key: 'axis', className: 'grid', x1: 64, x2: 564, y1: 180, y2: 180 }),
      h('text', { key: 'zero', x: 20, y: 186 }, '0'),
      h('text', { key: 'max', x: 20, y: 46 }, String(max)),
      h('polyline', {
        key: 'line',
        points: points.map((point, index) => `${x(index)},${y(point.count)}`).join(' '),
        fill: 'none',
        stroke: 'var(--accent)',
        strokeWidth: 3,
      }),
      ...points.flatMap((point, index) => [
        h('circle', {
          key: `p${index}`,
          className: 'mark',
          cx: x(index),
          cy: y(point.count),
          r: 6,
        }),
        h(
          'text',
          {
            key: `v${index}`,
            className: 'value',
            x: x(index),
            y: y(point.count) - 15,
            textAnchor: 'middle',
          },
          String(point.count),
        ),
        h('text', { key: `s${index}`, x: x(index), y: 215, textAnchor: 'middle' }, String(index)),
      ]),
    ],
  );
}

function bars(
  rows: readonly Readonly<{ label: string; value: number }>[],
  max: number,
  label: string,
): ReactNode {
  return graphic(
    label,
    rows.length * 52 + 30,
    rows.flatMap((row, index) => {
      const y = 18 + index * 52;
      return [
        h('text', { key: `n${index}`, x: 4, y: y + 15 }, String(index + 1).padStart(2, '0')),
        h('line', {
          key: `g${index}`,
          className: 'grid',
          x1: 64,
          x2: 560,
          y1: y + 8,
          y2: y + 8,
          strokeWidth: 15,
        }),
        h(
          'rect',
          {
            key: `b${index}`,
            className: 'mark',
            x: 64,
            y,
            width: (row.value / (max || 1)) * 496,
            height: 16,
            rx: 2,
          },
          h('title', null, `${row.label}: ${row.value}`),
        ),
        h('text', { key: `v${index}`, className: 'value', x: 588, y: y + 15 }, String(row.value)),
      ];
    }),
  );
}

export function AnalyticsView({ model }: Readonly<{ model: AnalyticsModel }>): ReactNode {
  const [analysis, setAnalysis] = useState<Analysis>('timeline');
  const [scope, setScope] = useState('all');
  const [showValues, setShowValues] = useState(true);
  const copy = model.copy;
  const cases = model.cases.filter((item) => scope === 'all' || item.id === scope);
  const distribution = model.distributions.find((item) => item.scope === scope)!;
  const sample =
    analysis === 'timeline'
      ? cases.reduce((sum, item) => sum + item.timeline.length, 0)
      : analysis === 'types'
        ? distribution.sample
        : analysis === 'candidates'
          ? cases.reduce((sum, item) => sum + item.candidates[0].count, 0)
          : cases.reduce((sum, item) => sum + item.stars.length, 0);
  const tableVisible = (content: ReactNode): ReactNode => (showValues ? content : null);
  const panel = (item: AnalyticsCase, content: ReactNode): ReactNode =>
    h(
      'section',
      { key: item.id, className: 'panel', 'aria-label': item.title },
      h('h3', null, item.title),
      h('p', { className: 'metadata' }, `${copy.attempt} ${item.attempt}`),
      content,
    );
  let content: ReactNode;
  if (analysis === 'timeline') {
    content = cases.map((item) =>
      panel(
        item,
        item.timelineEligible
          ? h(
              'div',
              null,
              h(
                'p',
                { className: 'metadata' },
                `${copy.sample} : ${item.timeline.length} ${copy.works}`,
              ),
              timelineChart(item.timeline, model),
              tableVisible(
                table(
                  [copy.timeline, copy.bounds, copy.museumDate],
                  item.timeline.map((row, index) => [
                    `${String(index + 1).padStart(2, '0')} · ${row.title}`,
                    h('span', null, interval(row, model), h('small', null, row.source)),
                    row.dateLabel ?? copy.unknown,
                  ]),
                  `${copy.timeline} · ${item.title}`,
                ),
              ),
            )
          : h('p', { className: 'empty' }, copy.locked),
      ),
    );
  } else if (analysis === 'types') {
    content = distribution.sample
      ? h(
          'section',
          { className: 'panel' },
          bars(
            distribution.rows.map((row) => ({
              label: row.label ?? copy.unknown,
              value: row.count,
            })),
            distribution.sample,
            `${copy.types} · ${distribution.sample} ${copy.works}`,
          ),
          tableVisible(
            table(
              [copy.types, copy.count, copy.source],
              distribution.rows.map((row, index) => [
                `${String(index + 1).padStart(2, '0')} · ${row.label ?? copy.unknown}`,
                String(row.count),
                h(
                  'span',
                  null,
                  `${copy.live}: ${row.live}`,
                  h(
                    'small',
                    null,
                    `${copy.reference}: ${row.reference}${row.referenceDates.length ? ` (${row.referenceDates.join(', ')})` : ''} · ${copy.unavailable}: ${row.unavailable}`,
                  ),
                ),
              ]),
              `${copy.sample} : ${distribution.sample} ${copy.works}`,
            ),
          ),
        )
      : h('p', { className: 'empty' }, copy.empty);
  } else if (analysis === 'candidates') {
    content = cases.map((item) =>
      panel(
        item,
        h(
          'div',
          null,
          h(
            'p',
            { className: 'metadata' },
            `${copy.sample} : ${item.candidates[0].count} ${copy.works} · ${item.candidateSource}`,
          ),
          candidateChart(item, model),
          tableVisible(
            table(
              [copy.step, copy.count],
              item.candidates.map((point, index) => [
                `${index} · ${point.label}`,
                String(point.count),
              ]),
              `${copy.candidates} · ${item.title}`,
            ),
          ),
        ),
      ),
    );
  } else {
    content = cases.map((item) =>
      panel(
        item,
        h(
          'div',
          null,
          h(
            'p',
            { className: 'metadata' },
            `${copy.sample} : ${item.stars.length} ${copy.puzzles}`,
          ),
          bars(
            item.stars,
            3,
            `${copy.stars} · ${item.stars.map((row) => `${row.label}: ${row.value}`).join(', ')}`,
          ),
          tableVisible(
            table(
              [copy.stars, copy.earned],
              item.stars.map((row, index) => [
                `${String(index + 1).padStart(2, '0')} · ${row.label}`,
                row.completed ? `${row.value} / 3` : copy.pending,
              ]),
              `${copy.stars} · ${item.title}`,
            ),
          ),
        ),
      ),
    );
  }
  return h(
    'div',
    { lang: model.language },
    h(
      'div',
      { className: 'toolbar' },
      h(
        'label',
        { className: 'scope' },
        copy.scope,
        h(
          'select',
          {
            value: scope,
            onChange: (event: ChangeEvent<HTMLSelectElement>) =>
              setScope(event.currentTarget.value),
          },
          h('option', { value: 'all' }, copy.allCases),
          ...model.cases.map((item) => h('option', { key: item.id, value: item.id }, item.title)),
        ),
      ),
      h('p', { className: 'summary' }, 'NOCTURNE / IV'),
    ),
    h(
      'div',
      { className: 'tabs', role: 'group', 'aria-label': copy.scope },
      ...(['timeline', 'types', 'candidates', 'stars'] as const).map((key, index) =>
        h(
          'button',
          {
            key,
            type: 'button',
            'aria-pressed': analysis === key,
            onClick: () => setAnalysis(key),
          },
          h('span', { className: 'index', 'aria-hidden': true }, `0${index + 1}`),
          copy[key],
        ),
      ),
    ),
    h(
      'header',
      { className: 'intro' },
      h('div', null, h('h2', null, copy[analysis]), h('p', null, copy[`${analysis}Note`])),
      h(
        'div',
        { className: 'metric' },
        h('strong', null, String(sample)),
        h('span', null, `${copy.sample} · ${analysis === 'stars' ? copy.puzzles : copy.works}`),
      ),
    ),
    analysis === 'timeline'
      ? h(
          'p',
          { className: 'metadata' },
          `${cases.filter((item) => item.timelineEligible).length} / ${cases.length} ${copy.eligible}`,
        )
      : null,
    h(
      'button',
      {
        className: 'value-toggle',
        type: 'button',
        'aria-expanded': showValues,
        onClick: () => setShowValues(!showValues),
      },
      showValues ? copy.hideValues : copy.values,
    ),
    content,
  );
}

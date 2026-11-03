import type { Diagram } from './types';

type Descs = Record<string, string>;

/** Architecture diagrams shared by both languages; labels/descriptions are passed in per language. */
export function dataPlatformDiagram(t: { batch: string; dashboards: string; dwh: string; desc: Descs }): Diagram {
  return {
    cols: 5,
    rows: 3,
    nodes: [
      { id: 'pg', label: 'PostgreSQL', sub: 'OLTP', col: 0, row: 0 },
      { id: 'mysql', label: 'MySQL', sub: 'OLTP', col: 0, row: 2 },
      { id: 'debezium', label: 'Debezium', sub: 'CDC', col: 1, row: 1 },
      { id: 'kafka', label: 'Kafka', sub: 'stream', col: 2, row: 1 },
      { id: 'spark', label: 'Spark · Airflow', sub: t.batch, col: 2, row: 0 },
      { id: 'starrocks', label: 'StarRocks', sub: t.dwh, col: 3, row: 1 },
      { id: 'bi', label: 'Power BI · Superset', sub: t.dashboards, col: 4, row: 1 },
    ].map((n) => ({ ...n, desc: t.desc[n.id] })),
    hot: ['pg', 'mysql', 'debezium', 'kafka', 'starrocks', 'bi'],
    edges: [
      ['pg', 'debezium'],
      ['mysql', 'debezium'],
      ['debezium', 'kafka'],
      ['kafka', 'starrocks'],
      ['pg', 'spark'],
      ['spark', 'starrocks'],
      ['starrocks', 'bi'],
    ],
  };
}

export function observabilityDiagram(t: { apps: string; policy: string; dashboards: string; alerts: string; monitoring: string; desc: Descs }): Diagram {
  return {
    cols: 5,
    rows: 3,
    nodes: [
      { id: 'policy', label: t.policy, sub: 'format · retention', col: 0, row: 0 },
      { id: 'apps', label: t.apps, sub: 'logs', col: 0, row: 2 },
      { id: 'logstash', label: 'Logstash', sub: 'ingest', col: 1, row: 1 },
      { id: 'es', label: 'Elasticsearch', sub: 'index', col: 2, row: 1 },
      { id: 'kibana', label: 'Kibana', sub: t.dashboards, col: 3, row: 0 },
      { id: 'grafana', label: 'Grafana', sub: t.monitoring, col: 3, row: 2 },
      { id: 'alerts', label: t.alerts, sub: 'on-call', col: 4, row: 1 },
    ].map((n) => ({ ...n, desc: t.desc[n.id] })),
    hot: ['apps', 'logstash', 'es', 'kibana', 'alerts'],
    edges: [
      ['policy', 'logstash'],
      ['apps', 'logstash'],
      ['logstash', 'es'],
      ['es', 'kibana'],
      ['es', 'grafana'],
      ['kibana', 'alerts'],
      ['grafana', 'alerts'],
    ],
  };
}

export function devopsDiagram(t: { images: string; data: string; monitoring: string; desc: Descs }): Diagram {
  return {
    cols: 5,
    rows: 3,
    nodes: [
      { id: 'git', label: 'Git · GitLab', sub: 'source', col: 0, row: 1 },
      { id: 'ci', label: 'CI/CD', sub: 'build · test', col: 1, row: 1 },
      { id: 'docker', label: 'Docker', sub: t.images, col: 2, row: 1 },
      { id: 'k8s', label: 'Kubernetes', sub: 'deploy', col: 3, row: 1 },
      { id: 'data', label: t.data, sub: 'Airflow · Spark', col: 4, row: 0 },
      { id: 'mon', label: t.monitoring, sub: 'ELK · Grafana', col: 4, row: 2 },
    ].map((n) => ({ ...n, desc: t.desc[n.id] })),
    hot: ['git', 'ci', 'docker', 'k8s'],
    edges: [
      ['git', 'ci'],
      ['ci', 'docker'],
      ['docker', 'k8s'],
      ['k8s', 'data'],
      ['k8s', 'mon'],
    ],
  };
}

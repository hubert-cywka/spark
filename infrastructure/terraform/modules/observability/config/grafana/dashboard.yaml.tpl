apiVersion: 1
providers:
  - name: 'Tempo Dashboards'
    orgId: 1
    folder: 'Observability'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    options:
      path: /etc/grafana/provisioning/dashboards/custom-dashboards
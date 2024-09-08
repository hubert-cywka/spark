# Proxy service
Entrypoint of our application. Uses envoy which acts as a reverse proxy and redirects network traffic to specific clusters.
It allows to expose our services to public, provides possibility for internal authorization, load-balancing, allows to modify requests/responses, etc.

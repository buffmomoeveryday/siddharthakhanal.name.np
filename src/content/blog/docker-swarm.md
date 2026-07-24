---
title: Docker Swarm
description: A quick note on what Docker Swarm is and when it is enough.
date: 2026-07-24
tags: [docker, ops, swarm]
---

# Docker Swarm

Docker Swarm is Docker's built-in clustering and orchestration mode. It lets you run containers across multiple machines while still using familiar Docker commands.

It is useful when you want something simpler than Kubernetes for a small service, internal tool, or homelab deployment.

## Basic idea

You create a swarm, add manager and worker nodes, then deploy services. Swarm keeps the requested number of containers running and can reschedule them if a node goes away.

```bash
docker swarm init
docker service create --name web --replicas 2 nginx
docker service ls
```

## When I would use it

- Small production services with modest traffic
- Internal apps where operational simplicity matters
- Projects that already use Docker Compose and do not need Kubernetes features

For larger platforms, complex networking, or many teams sharing a cluster, Kubernetes is usually the better long-term choice.

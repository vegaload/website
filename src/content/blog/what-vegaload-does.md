---
title: 'What VegaLoad does'
description: 'Ask your agent to write and run a load test. VegaLoad also covers fourteen protocols, pass-or-fail gates, host safety, and an offline report.'
date: 2026-10-20
author: Uma Mukkara
tags: [features, getting-started]
draft: false
---

VegaLoad is an open-source load tester for coding agents. You ask for a load test in plain words. The agent writes the file next to your code, runs it, and tells you whether it passed. The same commands work from the terminal. These are the main parts.

## Ask your agent

This is the main way to use VegaLoad. `vegaload init` sets up Claude Code and Cursor in this project. It adds skill files and an MCP server, so the agent can create a scenario, run it, read the results, suggest a threshold, diagnose a failure, and compare two runs.

**A new endpoint.** You say: "Write a load test for the checkout API and run it." The agent adds `checkout.vl.js` next to `checkout.js`, runs it, and saves `vegaload-report-<timestamp>.html`.

**A spec you already have.** You say: "Generate a load test from this OpenAPI file and run it." VegaLoad writes a scenario that calls every operation as a named step. A browser recording works the same way, with `vegaload import har`.

You can still start by hand with `vegaload new checkout`. Scenarios are JavaScript, or Python if you pass `-python`.

## Fourteen protocols

One binary speaks HTTP/1.1, HTTP/2, gRPC, WebSocket, MQTT, Kafka, PostgreSQL, MySQL, Redis, RabbitMQ, FTP, SFTP, TCP, and UDP. `vegaload protocols` lists the options and an example for each.

A scenario can call more than one of them. A CSV or JSON file can feed a row into each call.

## Pass or fail

A threshold turns a run into a gate:

```bash
vegaload run -target http://127.0.0.1:8080/health -protocol http1 \
  -threshold 'p95 < 300ms' \
  -threshold 'error_rate < 1%' \
  -vus 20 -duration 30s
```

A broken limit exits 3, which fails the job in CI. Save a good run with `-out`, then pass it later as `-baseline`. If p95 or the error rate gets worse than you allow with `-max-regression`, that run fails too.

## Only hosts you approve

Localhost is allowed. Any other host asks you to continue. In CI, pass `-yes` or name the host with `-allow-target`.

Every run is appended to `~/.vegaload/audit.log`. Hard caps limit a run to 24 hours, 10,000 virtual users, and 100,000 iterations a second.

## A report you can open

Each run writes `vegaload-report-<timestamp>.html`. It is one file, it opens offline, and it shows latency, throughput, and a row for each protocol. Nothing is sent to a dashboard.

`-junit results.xml` writes the same gates as JUnit, so your CI system can show them. On GitHub Actions, the summary is added to the job page.

## Where it runs

The binary is native on macOS, Linux, and Windows. There is no JVM and no Node runtime to install. The same tool is published as a container image and a Helm chart, for CI and for Kubernetes.

Install it from the [install guide](https://vegaload.github.io/vegaload/get-started/install).

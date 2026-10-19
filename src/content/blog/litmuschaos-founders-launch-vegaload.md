---
title: 'LitmusChaos Founders Launch VegaLoad: The Open-Source Load Testing Tool for Agentic Developers'
description: 'The founders of LitmusChaos launch VegaLoad, an open-source load testing tool for agentic developers. Here is why we built it, what it does, and how to run your first test.'
date: 2026-10-19
author: Uma Mukkara and Karthik Satchitanand
tags: [announcement, getting-started]
draft: true
---

We have spent the last ten years on resilience testing, in one form or another.

In 2017, we founded LitmusChaos. In 2019, we donated it to the CNCF. In 2022, we joined forces with Harness to build the enterprise product for resilience testing.

The last four years have been rewarding. We worked with large enterprises as they set up resilience testing and scaled it across many teams.

The last year taught us something new. Developers in these enterprises want to try resilience testing freely, and to innovate at their own pace. They also work with AI agents now. They need a truly agentic load testing tool. We think of it as a digital twin of LitmusChaos, for load.

So we decided to write exactly that. We call it **VegaLoad**. It is open source, and it is available today.

## Why we built it

LitmusChaos spread because it was open, simple and free to try. A developer could run a first chaos experiment in minutes. No ticket. No purchase order.

Load testing is often the opposite. The tool is separate. The scripts sit in another repo. A run means a ticket in someone's queue. Now agents write code faster than ever, and the gap is wider. Many services reach production with no load test at all.

We want a load test to be a file. It sits next to the code it tests. It goes through the same pull request. It runs in CI before the merge, and in CD after the deploy. And your agent can write it and run it for you.

## What VegaLoad is

VegaLoad is one small binary. It runs on macOS, Linux, Windows, Docker and Kubernetes. There is no JVM and no Node runtime to install.

- **Agent-ready.** You ask your agent for a load test. It writes the file and runs it. A built-in MCP server and skills work with Cursor and Claude Code.
- **14 protocols.** HTTP/1.1, HTTP/2, gRPC, WebSocket, MQTT, Kafka, PostgreSQL, MySQL, Redis, RabbitMQ, FTP, SFTP, TCP and UDP. One test can call all of them.
- **Pass or fail gates.** Set limits for p95 latency, error rate and checks. A broken limit stops the pull request in CI, or the rollout in CD.
- **Safe by default.** Localhost is always allowed. Any other host needs your approval. Every run goes to an audit log. Concurrency and duration have caps.
- **One report.** Each run writes a single HTML file. It opens offline, and you can attach it to a pull request.

## How to try it

1. **Install.** On macOS and Linux:

   ```bash
   brew install vegaload/tap/vegaload
   ```

   On Windows, download the zip and run `vegaload.exe`. You can also use Docker: `docker run --rm ghcr.io/vegaload/vegaload:latest version`.

2. **Set up your agent.** Run one command in your project:

   ```bash
   vegaload init
   ```

   It adds VegaLoad skills for your agent. It also sets up the MCP server for Cursor and Claude Code.

3. **Ask in plain words.** For example: "Write a load test for the checkout API and run it." The agent adds a file such as `checkout.vl.js` next to `checkout.js`, runs it, and saves `vegaload-report-<timestamp>.html`.

4. **Run it yourself.** You can also use the command line:

   ```bash
   vegaload run -target https://staging.example.com/health -protocol http1
   ```

   This host is not localhost, so VegaLoad asks you to confirm first. If a limit breaks, VegaLoad exits with code 3. That is what stops your pipeline.

5. **See what it can test.**

   ```bash
   vegaload protocols
   vegaload protocols sftp
   ```

   Save a good run as a baseline, and later runs flag regressions. VegaLoad also writes JUnit XML and a GitHub Actions job summary. The cookbook has ready-made recipes, including a GitHub Action.

## What comes next

We have already added many features to VegaLoad. We kept the version at 0.9.0 on purpose. Our next release is 1.0. It is for the features and fixes that come from the first use by the community.

We plan to let you import JMeter plans and k6 scripts. Teams that need cluster-scale load, shared history and chaos resilience probes can grow into Harness Resilience Testing. A command to move a test there is planned. Neither is released yet.

## Join us

VegaLoad is released under the Apache 2.0 license. Harness sponsors the project. Try it at [vegaload.ai](https://vegaload.ai). Read the code at [github.com/vegaload/vegaload](https://github.com/vegaload/vegaload). If you find a bug or miss a protocol, open an issue. Pull requests are welcome.

We built LitmusChaos with a community, and we want to build VegaLoad the same way. Tell us what you need.

Uma and Karthik

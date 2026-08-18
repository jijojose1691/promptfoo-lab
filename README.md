# LLM Application Evaluation Lab (`promptfoo`)

[![Promptfoo](https://img.shields.io/badge/Evaluated%20with-Promptfoo-purple.svg)](https://github.com/promptfoo/promptfoo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An end-to-end testing laboratory demonstrating how to evaluate production AI applications using [Promptfoo](https://github.com/promptfoo/promptfoo).

Unlike isolated prompt testing, this repository treats the **entire application service as the System Under Test (SUT)**. It evaluates real-world LLM capabilities—including session memory retention, tool integrations, and safety moderation—by executing automated assertions against a live application server.

---

## Architecture & Evaluation Flow

```text
┌─────────────────┐       1. Send Prompt      ┌─────────────────────────┐
│   Promptfoo     │ ────────────────────────> │ Your Application Server │
│ (Test Runner)   │                           │    (Node.js / Express)  │
└────────┬────────┘                           └────────────┬────────────┘
         │                                                 │
         │ 4. Evaluate Output                              │ 2. Execute Session,
         │    • String Inclusion                           │    Memory & Safety
         │    • Latency Benchmarks                         │    Logic
         │    • Model-Graded Rubrics                       ▼
         │                                    ┌─────────────────────────┐
         │ <───────────────────────────────── │   LLM / Tool System     │
         │          3. Return Response        │                         │
         └─────────────────────────────────── └─────────────────────────┘
---
title: 'VegaLoad 0.9.0: SFTP, results per protocol, and data files'
description: 'VegaLoad 0.9.0 adds SFTP, a report row for each protocol, thresholds on one protocol, a protocols command, and data files for direct runs.'
date: 2026-10-19
author: The VegaLoad team
tags: [release-notes, sftp, thresholds]
draft: true
---

VegaLoad 0.9.0 is out. This release adds SFTP. It also makes mixed tests easier to read, because the report now shows each protocol on its own row.

## SFTP

You can now load test an SFTP server. Use `-protocol sftp` on the command line, or the `sftp` global in a scenario file.

```bash
vegaload run -target sftp://load@files.example.com -protocol sftp \
  -opt password_env=SFTP_PASSWORD \
  -opt host_key=SHA256:YOUR_FINGERPRINT \
  -opt mode=roundtrip -opt allow_writes=true \
  -opt 'path=vegaload-{id}.bin' -opt size=1MiB \
  -vus 5 -duration 30s
```

The modes are connect, download, upload, list, stat, delete and roundtrip. A roundtrip uploads a file, downloads it, checks that the bytes are the same, and deletes it.

SFTP is safe by default:

- It is read-only until you set `allow_writes=true`.
- An unknown host key is refused. Give the fingerprint with `host_key`, or use `-insecure` for a test server.
- You log in with a password or a key file. The password comes from an environment variable, never from the command line.

## One row for each protocol

A scenario can call HTTP, a database and a file server in one test. Before, you saw one set of numbers for everything. Now the report shows a row for each protocol, and under it a row for each operation. Each row has calls, failures, error rate, p50, p95, max, and bytes sent and received.

FTP and SFTP also show the time of each phase: `connect_time`, `login_time`, `upload_time`, `download_time` and `delete_time`. So you can tell if a slow run was slow to log in or slow to transfer.

You can limit one protocol with a threshold:

```bash
vegaload run -target ftp://files.example.com -protocol ftp \
  -threshold 'p95{protocol="ftp"} < 500ms' \
  -threshold 'error_rate{protocol="ftp",op="roundtrip"} < 1%' \
  ...
```

If a protocol made no calls, its threshold fails. A limit that checks nothing never passes by mistake.

`vegaload compare` also prints each protocol's p95 and error rate. These lines show the change, but they never change the exit code.

## See every protocol

```bash
vegaload protocols
vegaload protocols sftp
vegaload protocols -output json
```

The command lists the 14 protocols, with the release that added each one, the URL schemes, the script calls, the options, and an example. The JSON format is stable, and it has a matching tool in the MCP server (`list_protocols`). So your agent can ask what VegaLoad supports before it picks a protocol.

## Data files in direct runs

`-data` now works with `-target` and `-protocol`. Put `{data.NAME.COLUMN}` in the body or in the job options. Each call takes one row.

```bash
vegaload run -target postgres://127.0.0.1:5432/app -protocol postgres \
  -data users.csv \
  -opt username=app -opt password_env=PGPASS \
  -body 'SELECT name, plan FROM users WHERE id = $1' \
  -opt 'args=[{data.users.id:int}]' \
  -vus 20 -duration 30s
```

This works for PostgreSQL, MySQL, Redis, FTP, SFTP, Kafka and RabbitMQ. For SQL, values go only through `args`, so a data file cannot change the SQL text. The report records the file name and the number of rows, never a cell. The other protocols say "not supported yet". Use a scenario file for those.

## Also in this release

- `concurrent_writes` for SFTP. In our test on a local OpenSSH link, uploads were about three times faster. It is off by default. Turn it on after you test it against your server.
- One SSH key parse for the whole run. Before, every virtual user parsed the key again, and an encrypted key made start-up slow.
- A Redis target with the wrong TLS setting now tells you to try `rediss://`, or the reverse.

## Things to know before you upgrade

- An unknown `-protocol` now exits with code 2, not 1. It prints the list of valid names and suggests the closest one.
- In a script, an HTTP 4xx or 5xx counts as a success in the protocol row. Only a transport error counts as failed. Use `check()` on the status to judge the response.
- `-secret-env` is for scenario files. With `-target` and `-protocol`, use `-opt password_env=NAME`.
- On macOS, a binary downloaded in a browser is blocked until you run `xattr -d com.apple.quarantine ./vegaload`. Installing with Homebrew does not have this problem.

## Get it

See the [install guide](https://vegaload.github.io/vegaload/get-started/install) or the [release page on GitHub](https://github.com/vegaload/vegaload/releases/tag/v0.9.0).

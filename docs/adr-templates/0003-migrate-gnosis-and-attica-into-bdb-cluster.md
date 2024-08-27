# CXE-ADR0003: Migrate Gnosis and Attica into BDB cluster

## Status
Proposed

## Context

Projects in IC systems all work in tandem. However, they are distributed among different clusters and it complicates the overall supportability of IC related systems. BDB is in its own BDB cluster where Gnosis and Attica is in Taco cluster. 

All these three applications work like independent applications and all three applications are different in terms of:
* the way applications can be accessed
* the way applications log data 
* tools that applications are suing for troubleshooting and maintenance

Because these applications are distributed across clusters, traffic from one application must leave source cluster and travel via private lint to the destination cluster. Not only this increases the delay for every request, it requires an infrastructure support for being able to communicate between different clusters.

## Decision

Attica, BDB and Gnosis should be moved into the single cluster. Once all three projects are in a single cluster, there will be a possibility for re-using various elements between projects, but most importantly, resources in various projects will work in a similar way (tools, logging, configuration), which simplifies troubleshooting for everyone. 

Proposed migration plan: [Gnosis Migration in BDB cluster](https://github.com/CXEPI/bdb-main/blob/master/RFCs/gnosis-migration-in-bdb-cluster.md).

## Consequences

* simplified troubleshooting and architecture
* recourse re-usability 
* decreased communication delay

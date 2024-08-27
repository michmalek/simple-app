# CXE-ADR0002: Decommission Asset Group Export Service

| |            |
| -------- |------------|
| **Status:**  | Published  |
| **Author:** | jhayduk    |
| **Date:**    | 2024-08-05 |
| **RFC:**    | n/a        |
| **Supersedes:**    | n/a        |
| **Deprecates:**    | n/a        |

## Context & Problem Statement

Originally, the [Asset Group Export](https://confluence-eng-sjc1.cisco.com/conf/display/CXCLOUD/Asset+Groups+and+Insights+Decoupling) service was implemented to decouple non-assets code from the Assets database to allow for future schema changes without impacting those other efforts. Once the feature was implemented, however, it became difficult to bubble up the effort to use it on backlogs for the services intended. Now, with CX Cloud expected to be re-architected and with work on what could be called “legacy CX Cloud” being reduced to only what is necessary to keep it running, there is no expectation of making schema changes in the Assets database, and both areas that were the target for use of this feature, namely Insights and Licensing, have no immediate, or even long term, plans to use it, and there is no expectation of using it in the future.

With the plans to move application infrastructure to a common account, the question arose as to whether this service should be migrated, allowed to sunset, or be turned off.

Since the feature itself has some cost, both in AWS runtime costs (currently, a little under $200 per month - this is after cost reduction efforts, it was much higher before), and in Engineering effort (to keep it up, current and up to date with security updates), the decision has been made to shut down the service altogether.

## Decision Drivers

From the "Context & Problem Statement" section,

* CX Cloud is expected to be re-architected
* Work on “legacy CX Cloud” is being reduced to only what is necessary to keep it running
* There is no expectation of making schema changes in the Assets data base
* Both services that were target for use of this feature, namely Insights and Licensing, have no immediate, or long term, plans to use it, and there is no expectation of doing it in the future.
* The feature itself has some cost, both in AWS runtime costs (currently, a little under $200 per month - this is after cost reduction efforts, it was much higher before), and in Engineering effort (to keep it up, current and up to date with security updates).

## Considered Options

* Migrate service to common account - This would continue to incur the cost of the service, and the cost of maintaining it, without any expected benefit.
* Allow service to sunset as everything else is migrated to the common account - This also continues to incur the cost, without any expected benefit for an expected, though not guaranteed, shorter period of time. Should the common account effort stall, or be cancelled, then the costs would continue to be incurred.
* Turn off the service now - This avoids the cost of the service, and the cost of maintaining it, since it has become evident there is no expected realization of the benefit it was intended to provide. This is that option that has been chosen.

## Decision Outcome

From the "Context & Problem Statement" section,

> The decision is to shut down the service.

### Positive Consequences

From the "Context & Problem Statement" section,

> Since the feature itself has some cost, both in AWS runtime costs (currently, a little under $200 per month - this is after cost reduction efforts, it was much higher before), and in Engineering effort to keep it up, current and up to date with security updates, the decision is to shut down the service.

Shutting down the service will avoid these costs.

### Negative Consequences

* The cx-asset-group-notifications-binary-logging-disabled-error-alarm is unique to the cx-asset-group-notification repository and requires its ECS task to be running. When the service is shut down, the monitoring for the binlog will no longer be present, as there is no other known way to do this from within the Assets code. SRE has stated that they intend to monitor for this situation, so, in theory, this should continue to be covered with that.
* One or more AWS Database Migration Service (DMS) connections will continue to be needed to support the Insights service (this is how that code is currently getting Asset group information data from the database). This does have a cost. However, since there are no plans for that code to move off of those connections, leaving the service up will not reduce that cost because that code would not be switching over to the service.
* The Licensing code is not currently consuming Asset group information from the Assets database at all, and it is questionable if that will ever do so. If it does after the decommissioning discussed here, it will need to use a DMS connection just like the Insights code is doing.

## Resources

* The [Asset Groups and Insights Decoupling](https://confluence-eng-sjc1.cisco.com/conf/display/CXCLOUD/Asset+Groups+and+Insights+Decoupling) wiki, and its subpages, discuss the service that is being decommissioned.
* The "Billing and Cost Management" dashboard and tools in the AWS console was used to see the cost of the service.
* The effort is being tracked under [CXC-37494 - Decommission Asset Group Export Service](https://cisco-jira.atlassian.net/browse/CXC-37494). The tasks under that jira can be consulted for for details, including what, specifically, is being done for the decommissioning process
  * [CXC-37287 - Decommission Asset Group Export Service - cx-asset-group-notifications](https://cisco-jira.atlassian.net/browse/CXC-37287)
  * [CXC-37351 - Decommission Asset Group Export Service - cx-asset-group-dumps](https://cisco-jira.atlassian.net/browse/CXC-37351)
  * [CXC-37457 - Decommission Asset Group Export Service - terraform-workspace-assets-app-infra](https://cisco-jira.atlassian.net/browse/CXC-37457)
  * [CXC-37493 - Decommission Asset Group Export Service - Cleanup](https://cisco-jira.atlassian.net/browse/CXC-37493)
* The service itself is implemented in two repositories, [cx-asset-group-notifications](https://github.com/CXEPI/cx-asset-group-notifications) and [cx-asset-group-dumps](https://github.com/CXEPI/cx-asset-group-dumps), with some related entries in the [terraform-workspace-assets-app-infra](https://github.com/CXEPI/terraform-workspace-assets-app-infra) repository.

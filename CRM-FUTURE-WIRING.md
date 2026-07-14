# Baker 1031 CRM — Future Wiring Roadmap

Last updated: 2026-07-14

This is the running list of placeholder, dummy, or local-only CRM features that still need to be connected to real data, authentication, storage, or external services. Update this file whenever a feature moves from mockup behavior to a real workflow.

## Current build status

The HTML prototype currently demonstrates the interface and local interactions. Data is placeholder data unless a row or control is explicitly described as local-only below.

## Prototype workflows completed

- [x] All People directory with search, stage and portal-access filters, sortable columns, and record navigation.
- [x] All Opportunities directory with all-opportunities and 1031-only All Exchanges views.
- [x] Local Deals List/Kanban toggle using the configurable Deal stages as columns.
- [x] Individual opportunity detail view for the current Canyon Ridge Apartments exchange.
- [x] Local task linking between the Deal detail view and Eric's person record.
- [x] Local Tasks workspace with filters, task creation, completion state, related-record display, grouping, and shared person/Deal updates.
- [x] Local Calendar workspace with merged placeholder events, source/time filters, meeting creation, and no-show state.
- [x] Local Dashboard, Settings, and Account views with consistent navigation and sidebar active states.
- [x] Local Dashboard insight cards with drill-down records, 1031 deadline watch, stale Deal/contact detection, and overlap merging by person plus exchange.
- [x] Local duplicate-contact detection with normalized email, phone, and name/state signals plus dismissal and merge-review placeholders.
- [x] Temporary client-side password gate and Lock CRM action for the prototype.
- [x] Investment portfolio tracking section with links, related opportunities, and client feedback states.
- [x] Local CSV export with selectable fields for visible People rows.
- [x] Local saved views for People and Deals, including default filters and browser-local custom views.
- [x] Local bulk actions for People and Deals: stage updates, task entry, and selected-record CSV export.
- [x] Local configurable person statuses (Cold, Accredited, Not Accredited, Do Not Market, Existing Client) and Deal stages (Cold, New Registration, Intro Call Scheduled, Reviewing Opportunities, Completing Paperwork, Closing, Closed), with add/remove controls that update filters and bulk actions.
- [x] Local CSV People import with header mapping, row creation, and duplicate-review handoff.
- [x] Local Reports workspace with stage funnel, conversion snapshot, history panel, and audit log display.
- [x] Local notification panel for deadline, stale-touch, and task alerts.
- [x] Local mobile-width preview toggle for responsive QA.
- [x] API/webhook settings placeholder with future endpoint, event names, and webhook setup action.
- [x] Local documented Heat Index formula with weighted signals and dashboard average.

## External integrations to wire up

- [ ] Gmail email sync — pull historical and new emails into the communication history; match messages to people and opportunities.
- [ ] Cal.com sync — pull past and upcoming meetings, attendance, cancellations, and no-show status.
- [ ] Google Calendar sync — pull meetings created outside Cal.com; merge duplicates by provider event ID first, then by normalized title, start time, and participant.
- [ ] Google Contacts sync — verify whether a person exists in Jerry’s contacts and map the connected contact ID.
- [ ] LinkedIn matching — replace the manual search link with an approved, privacy-safe matching workflow.
- [ ] Google Drive — save and open the person’s folder link; keep file management in Drive as designed.
- [ ] Constant Contact — connect the currently displayed “Push to Constant Contact” button only after audience, consent, field mapping, and duplicate rules are defined.

## Data and persistence

- [ ] Persist people, companies, opportunities, exchanges, investments, tasks, portfolios, offerings, feedback, and document views in the CRM database.
- [ ] Persist saved views, custom stage definitions, imports, notifications, reports, and audit events in the CRM database.
- [ ] Persist multiple email addresses and phone numbers, including primary labels and history.
- [ ] Add authentication, user roles, ownership, and record-level permissions.
- [ ] Add audit history for edits to exchange dates, financial metrics, access, consent, feedback, and stage.
- [ ] Replace all placeholder directory rows with the real People dataset.
- [ ] Replace all placeholder opportunity/exchange rows with the real opportunity dataset.

## Contact and compliance workflows

- [ ] Persist Investor Portal Access status and connect it to the portal account.
- [ ] Persist CRS received status, delivery date, delivery method, and acknowledgement evidence.
- [ ] Persist marketing consent and synchronize consent changes with the approved email platform.
- [ ] Add validation and permission controls for accreditation and suitability information.
- [ ] Define retention, export, deletion, and privacy rules for contact and communication data.

## Heat Index

- [ ] Replace the local prototype Heat Index formula with a configurable, persisted scoring model.
- [ ] Calculate email and meeting frequency from synced source data over defined time windows.
- [ ] Include registration date, last touch, upcoming meetings, meeting outcomes, stage, 45-day deadline, 180-day deadline, offering views, and client feedback.
- [ ] Add scheduled recalculation, score history, explanation logging, and user-configurable weighting.
- [ ] Add safeguards so the Heat Index is an internal workflow signal and is not presented as a suitability, credit, or investment recommendation.

## Opportunities and exchanges

- [ ] Persist opportunity type, exchange status, owner, stage, key dates, QI status, equity, debt, total, LTV, notes, and related person/company.
- [ ] Calculate and validate 45-day and 180-day deadlines from the relinquished-property sale date.
- [ ] Add deadline reminders and escalation tasks.
- [ ] Support multiple historical exchanges and current exchanges per person.
- [ ] Support cash investments alongside 1031 exchanges.
- [ ] Add stage history and reporting across Planning, Identifying, Reviewing, Invested, and Completed.
- [ ] Connect the opportunity detail page to edit, save, audit, and permission-controlled workflows.

## Tasks and communication history

- [ ] Persist tasks, assignees, due dates, completion state, reminders, and recurring follow-ups.
- [ ] Keep communication history read-only from synced Gmail, Cal.com, and Google Calendar sources unless a separate write action is intentionally approved.
- [ ] Record meeting outcomes, including attended, canceled, rescheduled, and no-show.
- [ ] Add communication matching rules for shared inboxes, aliases, assistants, and calendar attendees.

## Portfolios, offerings, and documents

- [ ] Persist investment portfolios created for a person.
- [ ] Link each portfolio to one or more specific opportunities or exchanges.
- [ ] Persist portfolio links, created date, version, client feedback, feedback date, and investment decision.
- [ ] Connect offering access and interest to the actual investor portal.
- [ ] Track offering-page views and document views from the real portal/document system.
- [ ] Define the source of truth for documents and preserve document version history.

## Export and reporting

- [x] Prototype CSV export with selectable fields for the currently visible People rows.
- [ ] Add server-side export with permission checks, export history, and secure handling of sensitive fields.
- [ ] Add export formats and saved export presets if needed.
- [ ] Build dashboard, pipeline, deadline, engagement, and source-of-referral reports from persisted data.

## Quality and operations

- [ ] Add duplicate detection and merge workflows for people, companies, opportunities, meetings, and offerings.
- [ ] Add error states, retry behavior, sync timestamps, and connection health indicators for each integration.
- [ ] Add automated tests for deadline calculations, deduplication, exports, permissions, and Heat Index scoring.
- [ ] Replace placeholder links and toast-only actions with real success, failure, and confirmation states.

## Update rule

When a placeholder becomes real, change its checkbox to `[x]`, add the implementation date, and note the source of truth or integration that now powers it. Add new placeholder items here as the CRM grows.

"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AUDIT_LOG,
  DEALS,
  DEAL_STAGES,
  MEETINGS,
  OFFERINGS,
  PEOPLE,
  PERSON_STATUSES,
  TASKS,
  Deal,
  Meeting,
  Offering,
  Person,
  Task,
} from "./data";

export type CrmView =
  | "dashboard"
  | "people"
  | "person"
  | "deals"
  | "deal"
  | "tasks"
  | "calendar"
  | "offerings"
  | "reports"
  | "settings"
  | "account";

type ModalKind = "contact" | "deal" | "task" | "edit-deal" | null;

const REFERENCE_DATE = new Date("2026-07-14T12:00:00Z");

const WORKSPACE_NAV: Array<{ view: CrmView; label: string; icon: string }> = [
  { view: "dashboard", label: "Dashboard", icon: "dashboard" },
  { view: "people", label: "People", icon: "people" },
  { view: "deals", label: "Deals", icon: "deals" },
  { view: "tasks", label: "Tasks", icon: "tasks" },
  { view: "calendar", label: "Calendar", icon: "calendar" },
  { view: "offerings", label: "Offerings", icon: "offerings" },
];

const MANAGE_NAV: Array<{ view: CrmView; label: string; icon: string }> = [
  { view: "reports", label: "Reports", icon: "reports" },
  { view: "settings", label: "Settings", icon: "settings" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  if (!value || value === "N/A") return value || "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatShortDate(value: string) {
  if (!value || value === "N/A") return value || "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function businessDaysSince(value: string) {
  const start = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(start.getTime())) return 0;
  const cursor = new Date(start);
  let days = 0;
  while (cursor < REFERENCE_DATE) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) days += 1;
  }
  return days;
}

function daysUntil(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return Math.ceil((date.getTime() - REFERENCE_DATE.getTime()) / 86400000);
}

function statusClass(value: string) {
  if (["Closed", "Existing Client"].includes(value)) return "completed";
  if (["Cold", "Do Not Market", "Not Accredited"].includes(value)) return "closed";
  return "";
}

function Icon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    people: <><circle cx="12" cy="8" r="3.2" /><path d="M5 21c.7-3.5 3-5.3 7-5.3s6.3 1.8 7 5.3" /></>,
    deals: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" /></>,
    tasks: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M7 14h.01M12 14h.01M17 14h.01M7 18h.01M12 18h.01" /></>,
    offerings: <><path d="M5 3h9l5 5v13H5z" /><path d="M14 3v6h5M8 13h8M8 17h6" /></>,
    reports: <><path d="M5 20V11M12 20V6M19 20V3M3 20h18" /></>,
    settings: <><path d="M9.2 3h5.6l.7 3a7.5 7.5 0 0 1 1.8 1l2.7-1 2.8 4.8-2.2 2a7.5 7.5 0 0 1 0 2.1l2.2 2-2.8 4.8-2.7-1a7.5 7.5 0 0 1-1.8 1l-.7 3H9.2l-.7-3a7.5 7.5 0 0 1-1.8-1l-2.7 1-2.8-4.8 2.2-2a7.5 7.5 0 0 1 0-2.1l-2.2-2 2.8-4.8 2.7 1a7.5 7.5 0 0 1 1.8-1z" /><circle cx="12" cy="13" r="2.5" /></>,
  };
  return <span className="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{icons[name]}</svg></span>;
}

function Card({
  title,
  id,
  actions,
  children,
  className = "",
}: {
  title?: string;
  id?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`} id={id}>
      {title ? (
        <div className="card-header">
          <h2>{title}</h2>
          {actions ? <div className="header-actions">{actions}</div> : null}
        </div>
      ) : null}
      <div className="card-body">{children}</div>
    </section>
  );
}

function PageHeader({
  eyebrow,
  title,
  subline,
  actions,
}: {
  eyebrow: string;
  title: string;
  subline?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="directory-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {subline ? <p className="directory-subline">{subline}</p> : null}
      </div>
      {actions ? <div className="directory-actions">{actions}</div> : null}
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  return <span className={`stage-pill ${statusClass(value)}`}>{value}</span>;
}

function AuthGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === "Benji") onUnlock();
    else setError(true);
  }

  return (
    <div className="auth-gate" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <section className="auth-card">
        <a className="brand" href="#top">
          <span className="brand-mark">B1</span>
          <span className="brand-name">Baker 1031 CRM</span>
        </a>
        <h1 id="auth-title">Unlock your CRM</h1>
        <p>Enter your workspace password to continue.</p>
        <form onSubmit={submit}>
          <div className="auth-field">
            <label htmlFor="crm-password">Password</label>
            <input id="crm-password" type="password" autoFocus required value={password} onChange={(event) => { setPassword(event.target.value); setError(false); }} />
          </div>
          {error ? <p className="auth-error show">That password doesn’t match. Please try again.</p> : null}
          <button className="primary-button auth-submit" type="submit">Unlock CRM</button>
        </form>
        <p className="auth-note">Temporary demo protection is enabled for this mockup. Production authentication must be server-side.</p>
      </section>
    </div>
  );
}

function Sidebar({ view, navigate, onAccount }: { view: CrmView; navigate: (view: CrmView) => void; onAccount: () => void }) {
  const links = (items: Array<{ view: CrmView; label: string; icon: string }>) => items.map((item) => (
    <a key={item.view} href={`#${item.view}`} className={view === item.view || (view === "person" && item.view === "people") || (view === "deal" && item.view === "deals") ? "active" : ""} onClick={(event) => { event.preventDefault(); navigate(item.view); }}>
      <Icon name={item.icon} /><span>{item.label}</span>
    </a>
  ));

  return (
    <aside className="sidebar" aria-label="CRM navigation">
      <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); navigate("dashboard"); }}>
        <span className="brand-mark">B1</span><span className="brand-name">Baker 1031 CRM</span>
      </a>
      <p className="nav-label">Workspace</p>
      <nav className="nav">{links(WORKSPACE_NAV)}</nav>
      <p className="nav-label" style={{ marginTop: 25 }}>Manage</p>
      <nav className="nav">{links(MANAGE_NAV)}</nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-footer">
        <a className="user-chip" href="#account" onClick={(event) => { event.preventDefault(); onAccount(); }}>
          <span className="avatar-small">JB</span>
          <div><strong>Jerry Baker</strong><span>Administrator</span></div>
          <span className="account-chevron" aria-hidden="true">⌄</span>
        </a>
      </div>
    </aside>
  );
}

function Topbar({
  view,
  selectedPerson,
  selectedDeal,
  globalSearch,
  setGlobalSearch,
  results,
  onResult,
  notificationOpen,
  setNotificationOpen,
  notifications,
  onNew,
}: {
  view: CrmView;
  selectedPerson?: Person;
  selectedDeal?: Deal;
  globalSearch: string;
  setGlobalSearch: (value: string) => void;
  results: Array<{ id: string; kind: string; title: string; detail: string; view: CrmView }>;
  onResult: (result: { id: string; view: CrmView }) => void;
  notificationOpen: boolean;
  setNotificationOpen: (value: boolean) => void;
  notifications: Array<{ title: string; detail: string }>;
  onNew: () => void;
}) {
  const record = view === "person" ? selectedPerson?.name : view === "deal" ? selectedDeal?.name : view === "people" ? "All people" : view === "deals" ? "Deals" : view[0].toUpperCase() + view.slice(1);
  return (
    <header className="topbar">
      <div className="breadcrumbs"><a href="#people">People</a><span aria-hidden="true"> / </span><strong>{record}</strong></div>
      <div className="top-actions">
        <input className="search" type="search" aria-label="Search entire CRM" placeholder="Search entire CRM" value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} />
        {globalSearch ? <div className="global-results open" role="listbox" aria-label="CRM search results">
          {results.length ? results.map((result) => <button className="global-result" key={`${result.kind}-${result.id}`} onClick={() => onResult(result)}><span className="global-result-icon">{result.kind === "Person" ? "♙" : result.kind === "Deal" ? "▣" : "✓"}</span><span><strong>{result.title}</strong><span>{result.kind} · {result.detail}</span></span></button>) : <div className="global-result-heading">No matching records</div>}
        </div> : null}
        <button className="icon-button notification-button" type="button" aria-label="Open notifications" aria-expanded={notificationOpen} onClick={() => setNotificationOpen(!notificationOpen)}><span aria-hidden="true">♧</span>{notifications.length ? <span className="notification-badge">{notifications.length}</span> : null}</button>
        {notificationOpen ? <div className="notification-panel" aria-label="Notifications"><div className="notification-panel-header"><strong>Notifications</strong><span>{notifications.length} open</span></div>{notifications.length ? notifications.slice(0, 6).map((item) => <div className="notification-item" key={`${item.title}-${item.detail}`}><strong>{item.title}</strong><small>{item.detail}</small></div>) : <div className="notification-item"><strong>All clear</strong><small>No current deadline, stale-touch, or task alerts.</small></div>}</div> : null}
        <button className="primary-button" type="button" onClick={onNew}>＋ New contact</button>
      </div>
    </header>
  );
}

function PeopleView({
  people,
  statuses,
  onSelect,
  onNew,
  onTogglePortal,
  onToast,
  onExport,
}: {
  people: Person[];
  statuses: string[];
  onSelect: (id: string) => void;
  onNew: () => void;
  onTogglePortal: (id: string) => void;
  onToast: (message: string) => void;
  onExport: (rows: Person[], fields: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [portal, setPortal] = useState("all");
  const [sortKey, setSortKey] = useState<"name" | "status" | "role" | "heat" | "portal" | "lastTouch">("name");
  const [sortDirection, setSortDirection] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [fields, setFields] = useState(["name", "role", "state", "status", "portal", "heat", "lastTouch"]);

  const matching = useMemo(() => {
    const query = search.toLowerCase().trim();
    return people.filter((person) => {
      const text = `${person.name} ${person.role} ${person.state} ${person.status}`.toLowerCase();
      return (!query || text.includes(query)) && (status === "all" || person.status === status) && (portal === "all" || String(person.portal) === portal);
    }).sort((a, b) => {
      const aValue = sortKey === "portal" ? String(a.portal) : String(a[sortKey]);
      const bValue = sortKey === "portal" ? String(b.portal) : String(b[sortKey]);
      if (sortKey === "heat") return (a.heat - b.heat) * sortDirection;
      return aValue.localeCompare(bValue) * sortDirection;
    });
  }, [people, search, status, portal, sortKey, sortDirection]);

  function sort(next: typeof sortKey) {
    if (next === sortKey) setSortDirection((current) => current * -1);
    else { setSortKey(next); setSortDirection(next === "heat" ? -1 : 1); }
  }

  function toggleSelected(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  const fieldLabels: Record<string, string> = { name: "Name", role: "Contact type / role", state: "State", status: "Person status", portal: "Portal access", heat: "Heat Index", lastTouch: "Last touch" };

  return (
    <section className="people-view">
      <PageHeader eyebrow="Workspace / People" title="All people" subline="Search, sort, and open every contact in the Baker 1031 CRM." actions={<><button className="outline-button" type="button" onClick={() => onToast("Import is ready for CSV mapping in the connected version")}>＋ Import</button><button className="primary-button" type="button" onClick={onNew}>＋ New contact</button></>} />
      <Card title="People directory" actions={<span className="directory-count">{matching.length} {matching.length === 1 ? "person" : "people"}</span>}>
        <div className="directory-toolbar">
          <div className="directory-controls">
            <input className="directory-search" type="search" placeholder="Search names, roles, or exchange status…" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select className="directory-filter" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by person status"><option value="all">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
            <select className="directory-filter" value={portal} onChange={(event) => setPortal(event.target.value)} aria-label="Portal Access"><option value="all">Portal Access: All</option><option value="true">Portal Access: Yes</option><option value="false">Portal Access: No</option></select>
            <button className="outline-button" type="button" onClick={() => onToast("Saved view created from the current filters")}>＋ Save view</button>
            <button className="outline-button" type="button" onClick={() => setExportOpen(!exportOpen)}>Export</button>
          </div>
          <span className="directory-count">Sorted by {sortKey === "role" ? "contact type / role" : sortKey} · {sortDirection === 1 ? "A–Z" : "Z–A"}</span>
        </div>
        {exportOpen ? <div className="card-body" style={{ background: "var(--soft-blue)", borderBottom: "1px solid var(--line)" }}><fieldset className="export-fields"><legend>Export fields</legend>{Object.entries(fieldLabels).map(([key, label]) => <label className="export-field" key={key}><input type="checkbox" checked={fields.includes(key)} onChange={() => setFields((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])} /><span>{label}</span></label>)}</fieldset><div className="match-actions"><button type="button" onClick={() => onExport(people.filter((person) => selected.includes(person.id)), fields)}>Export selected</button><button type="button" onClick={() => onExport(matching, fields)}>Export filtered</button><button type="button" onClick={() => onToast("Constant Contact push is reserved for the connected integration")}>Push to Constant Contact</button></div></div> : null}
        {selected.length ? <div className="bulk-toolbar"><strong>{selected.length} people selected</strong><select aria-label="Bulk person status" defaultValue=""><option value="" disabled>Set person status…</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select><button type="button" onClick={() => { setSelected([]); onToast("Bulk status update is staged for the connected version"); }}>Apply status</button><button type="button" onClick={() => onToast("Task created for selected people")}>Add task</button></div> : null}
        <div className="record-table-wrap"><table className="record-table people-table"><thead><tr><th className="select-cell"><input type="checkbox" className="select-all" aria-label="Select all people" checked={matching.length > 0 && matching.every((person) => selected.includes(person.id))} onChange={(event) => setSelected(event.target.checked ? matching.map((person) => person.id) : [])} /></th><th><button className={`sort-button ${sortKey === "name" ? "active" : ""}`} onClick={() => sort("name")}>Name <span className="sort-indicator">{sortKey === "name" ? (sortDirection === 1 ? "↑" : "↓") : "↕"}</span></button></th><th><button className={`sort-button ${sortKey === "status" ? "active" : ""}`} onClick={() => sort("status")}>Status <span className="sort-indicator">↕</span></button></th><th><button className={`sort-button ${sortKey === "role" ? "active" : ""}`} onClick={() => sort("role")}>Contact type / role <span className="sort-indicator">↕</span></button></th><th><button className={`sort-button ${sortKey === "heat" ? "active" : ""}`} onClick={() => sort("heat")}>Heat <span className="sort-indicator">↕</span></button></th><th><button className={`sort-button ${sortKey === "portal" ? "active" : ""}`} onClick={() => sort("portal")}>Portal access <span className="sort-indicator">↕</span></button></th><th><button className={`sort-button ${sortKey === "lastTouch" ? "active" : ""}`} onClick={() => sort("lastTouch")}>Last touch <span className="sort-indicator">↕</span></button></th></tr></thead><tbody>{matching.map((person) => <tr key={person.id}><td className="select-cell"><input type="checkbox" checked={selected.includes(person.id)} onChange={() => toggleSelected(person.id)} aria-label={`Select ${person.name}`} /></td><td><button className="person-link" onClick={() => onSelect(person.id)}><strong>{person.name}</strong><small>{person.exchangeStatus}</small></button></td><td><StatusPill value={person.status} /></td><td>{person.role}<small>{person.state}</small></td><td className="heat-cell">{person.heat}</td><td><button className={`switch ${person.portal ? "on" : ""}`} type="button" aria-label={`${person.name} portal access ${person.portal ? "on" : "off"}`} onClick={() => onTogglePortal(person.id)}><span /></button></td><td className="muted-cell">{formatDate(person.lastTouch)}</td></tr>)}</tbody></table></div>
        {!matching.length ? <p className="workspace-empty">No people match those filters.</p> : null}
      </Card>
      <Card title="Possible duplicate contacts" actions={<span className="directory-count">2 review groups</span>}>
        <div className="duplicate-group"><div className="duplicate-group-header"><strong>Eric</strong><span className="duplicate-reason">Matching email domain</span></div><div className="duplicate-records"><div className="duplicate-record"><strong>Eric</strong><small>eric@example.com · New Mexico</small></div><div className="duplicate-record"><strong>Eric Advisor</strong><small>eric.advisor@example.com · New Mexico</small></div></div><div className="duplicate-actions"><button className="outline-button" type="button" onClick={() => onToast("Duplicate merge review opened")}>Review match</button><button className="outline-button" type="button" onClick={() => onToast("Records marked as not duplicates")}>Not duplicates</button></div></div>
        <div className="duplicate-group"><div className="duplicate-group-header"><strong>Sarah Nguyen</strong><span className="duplicate-reason">Matching phone number</span></div><div className="duplicate-records"><div className="duplicate-record"><strong>Sarah Nguyen</strong><small>(415) 555-0155 · California</small></div><div className="duplicate-record"><strong>Sarah N.</strong><small>(415) 555-0156 · California</small></div></div><div className="duplicate-actions"><button className="outline-button" type="button" onClick={() => onToast("Duplicate merge review opened")}>Review match</button></div></div>
      </Card>
    </section>
  );
}

function PersonView({
  person,
  deals,
  tasks,
  meetings,
  offerings,
  onOpenDeal,
  onOpenTask,
  onTogglePortal,
  onToggleCrs,
  onNoShow,
  onToast,
  onToggleDone,
}: {
  person: Person;
  deals: Deal[];
  tasks: Task[];
  meetings: Meeting[];
  offerings: Offering[];
  onOpenDeal: (id: string) => void;
  onOpenTask: () => void;
  onTogglePortal: (id: string) => void;
  onToggleCrs: (id: string) => void;
  onNoShow: (id: string) => void;
  onToast: (message: string) => void;
  onToggleDone?: (id: string) => void;
}) {
  const [recordSearch, setRecordSearch] = useState("");
  const personDeals = deals.filter((deal) => deal.personId === person.id);
  const personTasks = tasks.filter((task) => task.personId === person.id);
  const personMeetings = meetings.filter((meeting) => meeting.personId === person.id);
  const personOfferings = offerings.filter((offering) => offering.personId === person.id);
  const query = recordSearch.toLowerCase().trim();
  const matches = (value: string) => !query || value.toLowerCase().includes(query);

  return (
    <section className="people-view">
      <div className="record-header">
        <div className="record-identity"><span className="avatar-large">{initials(person.name)}</span><div><p className="eyebrow">Person record</p><h1>{person.name}</h1><p className="subline">{person.role} · {person.state} · Local time · 1:40 PM {person.timezone}</p></div></div>
        <div className="record-actions"><span className="owner"><span className="owner-dot" /> Jerry Baker · Owner</span><StatusPill value={person.status} /><button className="outline-button" type="button" onClick={() => onToast("Person editing is ready for connected record storage")}>Edit</button><button className="primary-button" type="button" onClick={onOpenTask}>＋ Task</button></div>
      </div>
      <nav className="tabs" aria-label="Person record sections">
        <div className="toc-group"><span className="toc-group-label">Overview</span><div className="toc-group-links"><a href="#person-overview">Summary</a><a href="#person-details">Details</a><a href="#person-heat">Heat Index</a></div></div>
        <div className="toc-group"><span className="toc-group-label">Work</span><div className="toc-group-links"><a href="#person-exchange">Exchange</a><a href="#person-tasks">Tasks</a><a href="#person-investments">Investments</a></div></div>
        <div className="toc-group"><span className="toc-group-label">Engagement</span><div className="toc-group-links"><a href="#person-timeline">Timeline</a><a href="#person-offerings">Offerings</a><a href="#person-access">Access</a></div></div>
      </nav>

      <div className="record-layout" id="person-overview">
        <aside className="record-sidebar">
          <Card title="Contact information">
            <dl className="field-list">
              <div className="field"><dt>Email addresses</dt><dd className="contact-value-list">{person.emails.map((email) => <a href={`mailto:${email}`} key={email}>{email}</a>)}</dd><a className="inline-action" href="#add-email" onClick={(event) => { event.preventDefault(); onToast("Additional email field opened"); }}>＋ Add email</a></div>
              <div className="field"><dt>Phone numbers</dt><dd className="contact-value-list">{person.phones.map((phone) => <a href={`tel:${phone}`} key={phone}>{phone}</a>)}</dd><a className="inline-action" href="#add-phone" onClick={(event) => { event.preventDefault(); onToast("Additional phone field opened"); }}>＋ Add phone</a></div>
              <div className="field"><dt>Local time</dt><dd>1:40 PM {person.timezone}<small>Mountain / local time zone</small></dd></div>
              <div className="field"><dt>State</dt><dd>{person.state}</dd></div>
            </dl>
          </Card>
          <Card title="Details" id="person-details" actions={<button className="icon-button" type="button" onClick={() => onToast("Details editor opened")}>Edit</button>}>
            <dl className="field-grid">
              <div className="field"><dt>Role</dt><dd>{person.role}</dd></div>
              <div className="field"><dt>Registered</dt><dd>{formatDate(person.registered)}</dd></div>
              <div className="field"><dt>Marital status</dt><dd>{person.maritalStatus}</dd></div>
              <div className="field"><dt>Net worth band</dt><dd>{person.netWorth}</dd></div>
              <div className="field field-wide"><dt>Accreditation</dt><dd>{person.accreditation}</dd></div>
            </dl>
          </Card>
          <Card title="Contact matching">
            <div className="match-row"><div className="match-service"><span className="match-icon">♧</span><div><strong>Google Contacts</strong><small>{person.googleContacts === "saved" ? "Saved in your contacts" : "Not confirmed"}</small></div></div><span className={`match-status ${person.googleContacts === "saved" ? "saved" : "unconfirmed"}`}>{person.googleContacts === "saved" ? "Saved" : "Unconfirmed"}</span></div>
            <div className="match-row"><div className="match-service"><span className="match-icon">in</span><div><strong>LinkedIn</strong><small>{person.linkedin}</small></div></div><span className="match-status unconfirmed">Placeholder</span></div>
            <div className="match-actions"><button type="button" onClick={() => onToast("Google Contacts match check is ready for OAuth")}>Check Google Contacts</button><a href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(person.name)}`} target="_blank" rel="noreferrer">Search LinkedIn</a></div>
          </Card>
          <Card title="Access & documents" id="person-access">
            <div className="status-row"><div className="status-copy"><strong>Investor Portal Access</strong><span>{person.portal ? "Enabled" : "Not enabled"}</span></div><div className="toggle-wrap"><button className={`switch ${person.portal ? "on" : ""}`} type="button" aria-label="Toggle investor portal access" onClick={() => onTogglePortal(person.id)}><span /></button></div></div>
            <div className="status-row"><div className="status-copy"><strong>CRS received</strong><span>{person.crsReceived ? "Received" : "Not received"}</span></div><div className="toggle-wrap"><button className={`switch ${person.crsReceived ? "on" : ""}`} type="button" aria-label="Toggle CRS received" onClick={() => onToggleCrs(person.id)}><span /></button></div></div>
          </Card>
          <Card title="Google Drive folder">
            <div className="drive-file"><span className="drive-icon">▱</span><div><strong>Client folder</strong><small>Link-only location saved to this record.</small><a href={person.driveUrl} target="_blank" rel="noreferrer">Open folder ↗</a></div></div>
            <button className="outline-button" type="button" onClick={() => onToast("Drive folder location editor opened")}>Set folder location</button>
          </Card>
        </aside>

        <main className="record-main">
          <div className="overview-strip"><div><strong>{person.exchangeStatus}</strong><span>Registered {formatDate(person.registered)} · {personDeals.length} linked {personDeals.length === 1 ? "Deal" : "Deals"}</span></div><div className="overview-actions"><button className="outline-button" type="button" onClick={() => onToast("Email composer opened")}>Email</button><button className="primary-button" type="button" onClick={onOpenTask}>＋ Task</button></div></div>
          <div className="record-search-bar"><label htmlFor="record-search">Search this record</label><input id="record-search" type="search" placeholder="Emails, notes, meetings, offerings…" value={recordSearch} onChange={(event) => setRecordSearch(event.target.value)} /><span className="record-search-count">{recordSearch ? "Filtering" : "Full timeline"}</span></div>

          <Card title="Opportunity / Exchange" id="person-exchange" className="exchange-card" actions={<button className="icon-button" type="button" onClick={() => onToast("Exchange editor opened")}>Edit</button>}>
            <div className="exchange-stage"><span className="stage-dot" /><strong>{person.exchangeStatus}</strong><StatusPill value="Reviewing Opportunities" /></div>
            <div className="deadline-grid"><div className="deadline"><span>Sale closing</span><strong>{formatDate(person.saleClosing)}</strong></div><div className="deadline"><span>45-day deadline</span><strong>{formatDate(person.fortyFiveDay)}</strong></div><div className="deadline"><span>180-day deadline</span><strong>{formatDate(person.oneEightyDay)}</strong></div><div className="deadline"><span>Qualified intermediary</span><strong>{person.intermediary}</strong></div></div>
            <div className="metrics" style={{ marginTop: 12 }}>{personDeals.slice(0, 1).map((deal) => <><div className="metric" key="equity"><span>Equity</span><strong>{money(deal.equity)}</strong></div><div className="metric" key="debt"><span>Debt</span><strong>{money(deal.debt)}</strong></div><div className="metric" key="total"><span>Total</span><strong>{money(deal.total)}</strong></div><div className="metric" key="ltv"><span>LTV</span><strong>{deal.ltv}%</strong></div></>)}</div>
          </Card>

          <HeatCard person={person} id="person-heat" />

          <Card title="Next actions" id="person-tasks" actions={<button className="icon-button" type="button" onClick={onOpenTask}>＋ Task</button>}>
            <div className="task-table"><div className="task-row header"><span /><span>Done</span><span>Task</span><span>Record</span><span>Due date</span><span>Priority</span></div>{personTasks.filter((task) => matches(`${task.title} ${task.dueDate}`)).map((task) => <TaskRow key={task.id} task={task} person={person} deal={deals.find((deal) => deal.id === task.dealId)} onToast={onToast} onToggleDone={onToggleDone} />)}</div>
            {!personTasks.length ? <p className="workspace-empty">No tasks tied to this person.</p> : null}
          </Card>

          <Card title="Investment preferences" id="person-preferences">
            <div className="field-grid"><div className="field"><dt>Property types — like</dt><dd><TagList items={person.likeProperties} /></dd></div><div className="field"><dt>Property types — avoid</dt><dd><TagList items={person.avoidProperties} avoid /></dd></div><div className="field"><dt>Regions — like</dt><dd><TagList items={person.likeRegions} /></dd></div><div className="field"><dt>Regions — avoid</dt><dd><TagList items={person.avoidRegions} avoid /></dd></div><div className="field"><dt>Goals</dt><dd><TagList items={person.goals} /></dd></div><div className="field"><dt>Heard via</dt><dd>{person.heardVia}</dd></div></div>
          </Card>

          <Card title="Communication history" id="person-timeline" actions={<button className="icon-button" type="button" onClick={() => onToast("Full communication export prepared")}>View all</button>}>
            <div className="timeline-filter"><button className="active" type="button">All</button><button type="button">Emails</button><button type="button">Meetings</button><button type="button">Notes</button></div>
            <div className="full-timeline">{[
              { kind: "email", icon: "✉", title: "Welcome to Baker 1031", copy: "Registration follow-up and investor portal access instructions.", date: "Jul 8, 2026 · Gmail" },
              { kind: "note", icon: "✎", title: "Registration note", copy: `${person.name} is a ${person.role.toLowerCase()} in ${person.state} and heard about Baker 1031 through ${person.heardVia.toLowerCase()}.`, date: "Jul 8, 2026 · CRM note" },
              ...personMeetings.map((meeting) => ({ kind: "meeting", icon: "▣", title: meeting.title, copy: `${meeting.source} meeting · ${meeting.time}`, date: `${formatDate(meeting.date)} · ${meeting.status === "no-show" ? "No-show" : meeting.status}`, meeting })),
            ].filter((item) => matches(`${item.title} ${item.copy} ${item.date}`)).map((item) => <article className={`full-timeline-item ${item.kind} ${"meeting" in item && item.meeting.status === "no-show" ? "no-show" : ""}`} key={`${item.kind}-${item.title}`}><span className="full-timeline-icon">{item.icon}</span><div><strong>{item.title}</strong><p>{item.copy}</p></div><div className="timeline-item-actions"><span className="full-timeline-meta">{item.date}</span>{"meeting" in item ? <button className="meeting-no-show" type="button" disabled={item.meeting.status === "no-show"} onClick={() => onNoShow(item.meeting.id)}>{item.meeting.status === "no-show" ? "No-show recorded" : "No-show"}</button> : null}</div></article>)}</div>
          </Card>

          <Card title="Exchanges & investments" id="person-investments">
            <div className="record-table-wrap"><table className="record-table"><thead><tr><th>Investment / exchange</th><th>Type</th><th>Stage</th><th>Key date</th><th>Heat</th></tr></thead><tbody>{personDeals.map((deal) => <tr key={deal.id}><td><button className="person-link" onClick={() => onOpenDeal(deal.id)}><strong>{deal.name}</strong><small>{deal.statusLine}</small></button></td><td><span className={`record-type ${deal.type === "Cash investment" ? "cash" : ""}`}>{deal.type}</span></td><td><StatusPill value={deal.stage} /></td><td>{deal.keyDateLabel}<small>{formatDate(deal.keyDate)}</small></td><td className="heat-cell">{deal.heat}</td></tr>)}</tbody></table></div>
          </Card>

          <Card title="Investment portfolios" id="person-portfolios">
            <div className="record-table-wrap"><table className="record-table"><thead><tr><th>Portfolio</th><th>Tied to</th><th>Feedback</th><th>Link</th></tr></thead><tbody>{personOfferings.map((offering) => <tr key={offering.id}><td><strong>{offering.name} portfolio</strong><small>{offering.sponsor}</small></td><td>{deals.find((deal) => deal.id === offering.dealId)?.name ?? "—"}</td><td><span className={`feedback-pill ${offering.feedback === "Invested" ? "invested" : offering.feedback === "Thumbs up" ? "up" : "down"}`}>{offering.feedback}</span></td><td><a className="offering-link" href={offering.url} target="_blank" rel="noreferrer">Open portfolio ↗</a></td></tr>)}</tbody></table></div>
          </Card>

          <Card title="Offerings, access & document views" id="person-offerings">
            <div className="record-table-wrap"><table className="record-table"><thead><tr><th>Offering</th><th>Access</th><th>Feedback</th><th>Documents viewed</th></tr></thead><tbody>{personOfferings.map((offering) => <tr key={offering.id}><td><a className="offering-link" href={offering.url} target="_blank" rel="noreferrer">{offering.name} ↗</a><small>{offering.type}</small></td><td>{offering.status}</td><td><span className={`feedback-pill ${offering.feedback === "Invested" ? "invested" : offering.feedback === "Thumbs up" ? "up" : "down"}`}>{offering.feedback}</span></td><td className="doc-list">{offering.viewed.map((document) => <span key={document}><strong>{document}</strong><br /></span>)}</td></tr>)}</tbody></table></div>
          </Card>
        </main>
      </div>
    </section>
  );
}

function TagList({ items, avoid = false }: { items: string[]; avoid?: boolean }) {
  return <div className="tag-list">{items.length ? items.map((item) => <span className={`tag ${avoid ? "avoid" : ""}`} key={item}>{item}</span>) : <span className="field dd muted">None recorded</span>}</div>;
}

function HeatCard({ person, id }: { person: Person; id?: string }) {
  const signals = [
    ["Communication", `${person.emailCount} emails in recent history · 30%`],
    ["Meetings", `${person.meetingCount} scheduled meetings · 20%`],
    ["Recency", `${businessDaysSince(person.lastTouch)} business days since touch · 15%`],
    ["Registration", `Registered ${formatDate(person.registered)} · 10%`],
    ["Deadline", `${daysUntil(person.idDeadline)} days to key deadline · 15%`],
    ["Status", `${person.status} · 5%`],
    ["Offerings", `${person.offeringCount} offerings · 5%`],
  ];
  return <Card title="Heat Index" id={id} className="heat-index-card"><div><p className="heat-index-kicker">Relationship signal</p><div className="heat-index-title"><h2>{person.name}</h2><span className="heat-index-label">{person.heat >= 75 ? "Hot" : person.heat >= 50 ? "Warm" : "Cold"}</span></div><div className="heat-score"><strong>{person.heat}</strong><span>/ 100</span></div><div className="heat-index-bar"><span style={{ width: `${person.heat}%` }} /></div><p className="heat-index-copy">Weighted from communication, meetings, recency, registration, exchange deadlines, person status, and offering interest.</p></div><div className="heat-signals">{signals.map(([label, value]) => <div className="heat-signal" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></Card>;
}

function TaskRow({ task, person, deal, onToast, onToggleDone, compact = false }: { task: Task; person?: Person; deal?: Deal; onToast: (message: string) => void; onToggleDone?: (id: string) => void; compact?: boolean }) {
  return <div className={compact ? "workspace-task-row" : "task-row"}><span className="task-icon">{task.done ? "✓" : "□"}</span><input type="checkbox" checked={task.done} onChange={() => onToggleDone ? onToggleDone(task.id) : onToast(`${task.done ? "Reopened" : "Completed"}: ${task.title}`)} aria-label={`Mark ${task.title} complete`} /><span className="task-name">{task.title}</span>{compact ? <span className="task-record"><strong>{person?.name ?? "Unassigned"}</strong><small>{deal?.name ?? "Person task"}</small></span> : <span className="assignee"><span className="assignee-avatar">JB</span> JB</span>}<span>{formatShortDate(task.dueDate)}</span><span>{task.priority}</span><button className="icon-button" type="button" onClick={() => onToast("Task details opened")} aria-label="More task options">…</button></div>;
}

function DealsView({
  deals,
  people,
  stages,
  onSelect,
  onNew,
  onToast,
}: {
  deals: Deal[];
  people: Person[];
  stages: string[];
  onSelect: (id: string) => void;
  onNew: () => void;
  onToast: (message: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [stage, setStage] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [sortKey, setSortKey] = useState<"name" | "type" | "person" | "stage" | "date" | "heat">("name");
  const [sortDirection, setSortDirection] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const matching = useMemo(() => deals.filter((deal) => {
    const person = people.find((item) => item.id === deal.personId)?.name ?? "";
    const query = search.toLowerCase().trim();
    return (!query || `${deal.name} ${person} ${deal.owner}`.toLowerCase().includes(query)) && (type === "all" || deal.type === type) && (stage === "all" || deal.stage === stage);
  }).sort((a, b) => {
    const personA = people.find((item) => item.id === a.personId)?.name ?? "";
    const personB = people.find((item) => item.id === b.personId)?.name ?? "";
    const aValue = sortKey === "person" ? personA : sortKey === "date" ? a.keyDate : String(a[sortKey]);
    const bValue = sortKey === "person" ? personB : sortKey === "date" ? b.keyDate : String(b[sortKey]);
    if (sortKey === "heat") return (a.heat - b.heat) * sortDirection;
    return aValue.localeCompare(bValue) * sortDirection;
  }), [deals, people, search, type, stage, sortKey, sortDirection]);

  function sort(next: typeof sortKey) {
    if (next === sortKey) setSortDirection((current) => current * -1);
    else { setSortKey(next); setSortDirection(next === "heat" ? -1 : 1); }
  }

  return <section className="opportunity-view"><PageHeader eyebrow="Workspace / Deals" title="All opportunities & exchanges" subline="Track current and historical 1031 exchanges alongside cash investments." actions={<><button className="outline-button" type="button" onClick={onNew}>＋ Add opportunity / exchange</button><button className="primary-button" type="button" onClick={onNew}>＋ New opportunity</button></>} /><Card title="Opportunity & exchange directory" actions={<span className="directory-count">{matching.length} opportunities</span>}><div className="directory-toolbar"><div className="directory-controls"><input className="directory-search" type="search" placeholder="Search opportunities, people, or owners…" value={search} onChange={(event) => setSearch(event.target.value)} /><select className="directory-filter" value={type} onChange={(event) => setType(event.target.value)}><option value="all">All types</option><option value="1031 exchange">1031 exchanges</option><option value="Cash investment">Cash investments</option></select><select className="directory-filter" value={stage} onChange={(event) => setStage(event.target.value)}><option value="all">All stages</option>{stages.map((item) => <option key={item}>{item}</option>)}</select><button className="outline-button" type="button" onClick={() => onToast("Saved Deal view created")}>＋ Save view</button></div><span className="directory-count">Sorted by {sortKey} · {sortDirection === 1 ? "A–Z" : "Z–A"}</span></div>{selected.length ? <div className="bulk-toolbar"><strong>{selected.length} Deals selected</strong><select aria-label="Bulk Deal stage" defaultValue=""><option value="" disabled>Set Deal stage…</option>{stages.map((item) => <option key={item}>{item}</option>)}</select><button type="button" onClick={() => { setSelected([]); onToast("Bulk Deal stage update is staged"); }}>Apply stage</button><button type="button" onClick={() => onToast("Task created for selected Deals")}>Add task</button></div> : null}<div className="card-body" style={{ paddingTop: 0, paddingBottom: 0 }}><div className="opportunity-view-toggle" role="group" aria-label="Deal view"><button className={viewMode === "list" ? "active" : ""} type="button" onClick={() => setViewMode("list")}>List</button><button className={viewMode === "kanban" ? "active" : ""} type="button" onClick={() => setViewMode("kanban")}>Kanban</button></div></div>{viewMode === "list" ? <div className="record-table-wrap"><table className="record-table opportunity-table"><thead><tr><th className="select-cell"><input type="checkbox" className="select-all" checked={matching.length > 0 && matching.every((deal) => selected.includes(deal.id))} onChange={(event) => setSelected(event.target.checked ? matching.map((deal) => deal.id) : [])} aria-label="Select all Deals" /></th><th><SortButton label="Opportunity" active={sortKey === "name"} direction={sortDirection} onClick={() => sort("name")} /></th><th><SortButton label="Type" active={sortKey === "type"} direction={sortDirection} onClick={() => sort("type")} /></th><th><SortButton label="Person" active={sortKey === "person"} direction={sortDirection} onClick={() => sort("person")} /></th><th><SortButton label="Stage" active={sortKey === "stage"} direction={sortDirection} onClick={() => sort("stage")} /></th><th><SortButton label="Key date" active={sortKey === "date"} direction={sortDirection} onClick={() => sort("date")} /></th><th><SortButton label="Heat" active={sortKey === "heat"} direction={sortDirection} onClick={() => sort("heat")} /></th></tr></thead><tbody>{matching.map((deal) => { const person = people.find((item) => item.id === deal.personId); return <tr key={deal.id}><td className="select-cell"><input type="checkbox" checked={selected.includes(deal.id)} onChange={() => setSelected((current) => current.includes(deal.id) ? current.filter((item) => item !== deal.id) : [...current, deal.id])} aria-label={`Select ${deal.name}`} /></td><td><button className="opportunity-name" onClick={() => onSelect(deal.id)}><span className={`opportunity-type ${deal.type === "Cash investment" ? "cash" : ""}`}>{deal.type}</span><strong>{deal.name}</strong><small>{deal.statusLine}</small></button></td><td>{deal.type}</td><td>{person?.name}</td><td><StatusPill value={deal.stage} /></td><td className="date-cell">{deal.keyDateLabel}<br /><strong>{formatDate(deal.keyDate)}</strong></td><td className="heat-cell">{deal.heat}</td></tr>; })}</tbody></table></div> : <div className="opportunity-kanban-wrap"><p className="kanban-scroll-note">Scroll horizontally to see every Deal stage.</p><div className="opportunity-kanban" style={{ "--kanban-columns": stages.length } as React.CSSProperties}>{stages.map((currentStage) => <div className="kanban-column" key={currentStage}><div className="kanban-column-header"><strong>{currentStage}</strong><span>{matching.filter((deal) => deal.stage === currentStage).length}</span></div><div className="kanban-column-body">{matching.filter((deal) => deal.stage === currentStage).map((deal) => { const person = people.find((item) => item.id === deal.personId); return <button className="kanban-card" key={deal.id} onClick={() => onSelect(deal.id)}><span className={`kanban-card-type ${deal.type === "Cash investment" ? "cash" : ""}`}>{deal.type}</span><strong>{deal.name}</strong><small>{person?.name} · Last touch {formatDate(deal.lastTouch)}</small><div className="kanban-card-meta"><span>Key date {formatShortDate(deal.keyDate)}</span><strong>{deal.heat}</strong></div></button>; })}{!matching.some((deal) => deal.stage === currentStage) ? <span className="kanban-empty">No Deals in this stage</span> : null}</div></div>)}</div></div>}<div className="card-body"><p className="placeholder-note">Native React Deal directory. The connected version will calculate deadlines, stage history, ownership, and financial metrics from persisted opportunity records.</p></div></Card></section>;
}

function SortButton({ label, active, direction, onClick }: { label: string; active: boolean; direction: number; onClick: () => void }) {
  return <button className={`sort-button ${active ? "active" : ""}`} type="button" onClick={onClick}>{label} <span className="sort-indicator">{active ? (direction === 1 ? "↑" : "↓") : "↕"}</span></button>;
}

function DealView({ deal, person, tasks, meetings, onBack, onEdit, onOpenPerson, onOpenTask, onNoShow, onToast, onToggleDone }: { deal: Deal; person: Person; tasks: Task[]; meetings: Meeting[]; onBack: () => void; onEdit: () => void; onOpenPerson: () => void; onOpenTask: () => void; onNoShow: (id: string) => void; onToast: (message: string) => void; onToggleDone: (id: string) => void }) {
  const dealTasks = tasks.filter((task) => task.dealId === deal.id);
  const dealMeetings = meetings.filter((meeting) => meeting.dealId === deal.id);
  return <section className="opportunity-view"><div className="detail-toolbar"><button className="back-link" onClick={onBack}>← All Deals</button><div className="detail-actions"><button className="outline-button" type="button" onClick={onEdit}>Edit Deal</button><button className="primary-button" type="button" onClick={onOpenTask}>＋ Task</button></div></div><header className="opportunity-detail-header"><div className="opportunity-detail-identity"><span className="opportunity-icon">↗</span><div><p className="eyebrow">{deal.type}</p><h1>{deal.name}</h1><p className="opportunity-detail-status">{deal.statusLine} · Current record for {person.name}</p></div></div><StatusPill value={deal.stage} /></header><nav className="detail-tabs" aria-label="Deal sections"><a href="#deal-overview">Overview</a><a href="#deal-milestones">Milestones</a><a href="#deal-tasks">Tasks</a><a href="#deal-history">Communication</a><a href="#deal-person">Person</a></nav><div className="opportunity-detail-grid"><div className="opportunity-detail-main"><Card title="Deal details" id="deal-overview" actions={<button className="icon-button" type="button" onClick={onEdit}>Edit</button>}><dl className="detail-field-grid"><div className="field"><dt>Type</dt><dd>{deal.type}</dd></div><div className="field"><dt>Stage</dt><dd><StatusPill value={deal.stage} /></dd></div><div className="field"><dt>Key date</dt><dd>{deal.keyDateLabel}<small>{formatDate(deal.keyDate)}</small></dd></div><div className="field"><dt>Last touch</dt><dd>{formatDate(deal.lastTouch)}</dd></div><div className="field field-wide"><dt>Notes</dt><dd>{deal.note}</dd></div></dl><div className="metrics" style={{ marginTop: 18 }}><div className="metric"><span>Equity</span><strong>{money(deal.equity)}</strong></div><div className="metric"><span>Debt</span><strong>{money(deal.debt)}</strong></div><div className="metric"><span>Total</span><strong>{money(deal.total)}</strong></div><div className="metric"><span>LTV</span><strong>{deal.ltv}%</strong></div></div></Card><Card title="Exchange milestones" id="deal-milestones" className="phase-card"><div className="milestone-list">{[["Sale closing", deal.keyDate], ["45-day identification deadline", deal.idDeadline ?? "N/A"], ["180-day completion deadline", deal.idDeadline ? "2027-02-11" : "N/A"]].map(([label, date]) => <div className="milestone" key={label}><span className="milestone-dot" /><div><strong>{label}</strong><small>{date === "N/A" ? "Not applicable" : "Tracked deadline"}</small></div><span className="milestone-date">{formatDate(date)}</span></div>)}</div></Card><Card title="Communication" id="deal-history"><div className="full-timeline">{dealMeetings.map((meeting) => <article className={`full-timeline-item meeting ${meeting.status === "no-show" ? "no-show" : ""}`} key={meeting.id}><span className="full-timeline-icon">▣</span><div><strong>{meeting.title}</strong><p>{meeting.source} meeting · {meeting.time}</p></div><div className="timeline-item-actions"><span className="full-timeline-meta">{formatDate(meeting.date)}</span><button className="meeting-no-show" disabled={meeting.status === "no-show"} onClick={() => onNoShow(meeting.id)}>{meeting.status === "no-show" ? "No-show recorded" : "No-show"}</button></div></article>)}</div></Card></div><aside className="opportunity-detail-side"><Card title="Linked person" id="deal-person"><button className="linked-person-card" onClick={onOpenPerson}><span className="linked-person-avatar">{initials(person.name)}</span><span><strong>{person.name}</strong><small>{person.role} · {person.state}</small></span></button></Card><Card title="Next tasks" id="deal-tasks"><div className="task-table">{dealTasks.map((task) => <TaskRow key={task.id} task={task} person={person} deal={deal} onToast={onToast} onToggleDone={onToggleDone} />)}</div><div className="task-add"><button className="offering-link" onClick={onOpenTask}>＋ Task</button></div></Card><Card title="Relationship signal"><HeatCard person={person} /></Card></aside></div></section>;
}

function DashboardView({ people, deals, tasks, onNavigate, onToast }: { people: Person[]; deals: Deal[]; tasks: Task[]; onNavigate: (view: CrmView, id?: string) => void; onToast: (message: string) => void }) {
  const averageHeat = Math.round(people.reduce((sum, person) => sum + person.heat, 0) / people.length);
  const deadlines = deals.filter((deal) => deal.type === "1031 exchange" && deal.idDeadline && daysUntil(deal.idDeadline) >= 0 && daysUntil(deal.idDeadline) <= 7);
  const staleDeals = deals.filter((deal) => deal.stage !== "Closed" && businessDaysSince(deal.lastTouch) >= 3);
  const stalePeople = people.filter((person) => businessDaysSince(person.lastTouch) >= 7);
  const dedupedAttention = [...staleDeals.map((deal) => ({ key: `${deal.personId}-${deal.id}`, title: deal.name, detail: `${people.find((person) => person.id === deal.personId)?.name} · Deal untouched ${businessDaysSince(deal.lastTouch)} business days`, view: "deal" as CrmView, id: deal.id })), ...stalePeople.map((person) => ({ key: `${person.id}-person`, title: person.name, detail: `Contact untouched ${businessDaysSince(person.lastTouch)} business days`, view: "person" as CrmView, id: person.id }))].filter((item, index, items) => items.findIndex((candidate) => candidate.key.split("-")[0] === item.key.split("-")[0]) === index);
  const stats = [
    { label: "People", value: people.length, note: "Total contacts", view: "people" as CrmView },
    { label: "Open Deals", value: deals.filter((deal) => deal.stage !== "Closed").length, note: "Current opportunities", view: "deals" as CrmView },
    { label: "Deadlines next 7 days", value: deadlines.length, note: "1031 exchange ID deadlines", view: "deals" as CrmView },
    { label: "Average Heat Index", value: averageHeat, note: "Across all people", view: "people" as CrmView },
  ];
  return <section className="workspace-view"><PageHeader eyebrow="Workspace / Overview" title="Dashboard" subline="A focused view of relationships, deadlines, and next actions." actions={<button className="primary-button" type="button" onClick={() => onNavigate("people")}>Open people</button>} /><div className="dashboard-grid">{stats.map((stat) => <button className="dashboard-stat" key={stat.label} onClick={() => onNavigate(stat.view)}><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.note} · View details →</small></button>)}</div><div className="dashboard-columns"><Card title="1031 Exchange ID Deadlines · Next 7 Days"><div className="dashboard-list">{deadlines.length ? deadlines.map((deal) => <div className="dashboard-list-item" key={deal.id}><div><strong>{deal.name}</strong><small>{people.find((person) => person.id === deal.personId)?.name} · deadline {formatDate(deal.idDeadline ?? "")}</small></div><button className="offering-link" onClick={() => onNavigate("deal", deal.id)}>Open Deal</button></div>) : <p className="workspace-empty">No exchange ID deadlines in the next 7 days.</p>}</div></Card><Card title="Needs attention"><div className="dashboard-list">{dedupedAttention.length ? dedupedAttention.map((item) => <div className="dashboard-list-item" key={item.key}><div><strong>{item.title}</strong><small>{item.detail}</small></div><button className="offering-link" onClick={() => onNavigate(item.view, item.id)}>Open</button></div>) : <p className="workspace-empty">No stale records.</p>}</div></Card></div><div className="dashboard-columns"><Card title="Priority work"><div className="dashboard-list">{tasks.filter((task) => !task.done).slice(0, 4).map((task) => <div className="dashboard-list-item" key={task.id}><div><strong>{task.title}</strong><small>{people.find((person) => person.id === task.personId)?.name} · due {formatDate(task.dueDate)}</small></div><span className="stage-pill">{task.priority}</span></div>)}</div></Card><Card title="Recent activity"><div className="audit-list">{AUDIT_LOG.slice(0, 4).map((entry) => <div className="audit-item" key={`${entry.time}-${entry.action}`}><time>{entry.time}</time><div><strong>{entry.action}</strong><small>{entry.record} · {entry.details}</small></div></div>)}</div></Card></div><Card title="Heat Index formula" actions={<button className="icon-button" type="button" onClick={() => onToast("Heat Index formula copied")}>Copy formula</button>}><p className="placeholder-note">Heat = Communication 30% + Meetings 20% + Recency 15% + Registration 10% + Deadline 15% + Person status 5% + Offering interest 5%. Each signal is normalized to its weighted contribution and capped at 100.</p></Card></section>;
}

function TasksView({ tasks, people, deals, onNew, onToast, onToggleDone }: { tasks: Task[]; people: Person[]; deals: Deal[]; onNew: () => void; onToast: (message: string) => void; onToggleDone: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState<"dueDate" | "record">("dueDate");
  const visible = tasks.filter((task) => `${task.title} ${people.find((person) => person.id === task.personId)?.name ?? ""} ${deals.find((deal) => deal.id === task.dealId)?.name ?? ""}`.toLowerCase().includes(search.toLowerCase().trim()));
  const groups = visible.reduce<Record<string, Task[]>>((result, task) => { const person = people.find((item) => item.id === task.personId); const deal = deals.find((item) => item.id === task.dealId); const key = groupBy === "dueDate" ? formatDate(task.dueDate) : `${person?.name ?? "Unassigned"}${deal ? ` · ${deal.name}` : ""}`; (result[key] ??= []).push(task); return result; }, {});
  return <section className="workspace-view"><PageHeader eyebrow="Workspace / Tasks" title="Tasks" subline="Every follow-up, tied to the person and Deal it belongs to." actions={<button className="primary-button" type="button" onClick={onNew}>＋ New task</button>} /><Card title="Task list" actions={<span className="directory-count">{visible.length} tasks</span>}><div className="workspace-toolbar"><div className="workspace-controls"><input className="directory-search" type="search" placeholder="Search tasks or linked records…" value={search} onChange={(event) => setSearch(event.target.value)} /><select className="directory-filter" value={groupBy} onChange={(event) => setGroupBy(event.target.value as "dueDate" | "record")}><option value="dueDate">Group by due date</option><option value="record">Group by record</option></select></div><span className="directory-count">{visible.filter((task) => !task.done).length} open</span></div><div className="workspace-list"><div className="workspace-task-row header"><span /><span>Done</span><span>Task</span><span>Record tied to</span><span>Due date</span><span>Priority</span><span /></div>{Object.entries(groups).map(([group, groupTasks]) => <div className="task-group" key={group}><div className="task-group-header"><strong>{group}</strong><span>{groupTasks.length} tasks</span></div>{groupTasks.map((task) => <TaskRow key={task.id} task={task} person={people.find((person) => person.id === task.personId)} deal={deals.find((deal) => deal.id === task.dealId)} onToast={onToast} onToggleDone={onToggleDone} compact />)}</div>)}</div>{!visible.length ? <p className="workspace-empty">No tasks match your search.</p> : null}</Card></section>;
}

function CalendarView({ meetings, people, deals, onNoShow, onToast }: { meetings: Meeting[]; people: Person[]; deals: Deal[]; onNoShow: (id: string) => void; onToast: (message: string) => void }) {
  const [search, setSearch] = useState("");
  const [time, setTime] = useState("all");
  const [source, setSource] = useState("all");
  const visible = meetings.filter((meeting) => { const text = `${meeting.title} ${people.find((person) => person.id === meeting.personId)?.name ?? ""}`.toLowerCase(); const isPast = meeting.status !== "upcoming"; return (!search || text.includes(search.toLowerCase())) && (time === "all" || (time === "past" ? isPast : !isPast)) && (source === "all" || meeting.source === source); }).sort((a, b) => a.date.localeCompare(b.date));
  return <section className="workspace-view"><PageHeader eyebrow="Workspace / Calendar" title="Calendar" subline="Combined Cal.com and Google Calendar meetings, with duplicates removed." actions={<button className="outline-button" type="button" onClick={() => onToast("Calendar sync settings opened")}>Sync calendars</button>} /><Card title="Meetings" actions={<span className="directory-count">{visible.length} meetings</span>}><div className="workspace-toolbar"><div className="workspace-controls"><input className="directory-search" type="search" placeholder="Search meetings or people…" value={search} onChange={(event) => setSearch(event.target.value)} /><select className="directory-filter" value={time} onChange={(event) => setTime(event.target.value)}><option value="all">All meetings</option><option value="upcoming">Upcoming</option><option value="past">Past</option></select><select className="directory-filter" value={source} onChange={(event) => setSource(event.target.value)}><option value="all">All sources</option><option value="Cal.com">Cal.com</option><option value="Google Calendar">Google Calendar</option></select></div></div><div className="workspace-list">{visible.map((meeting) => { const person = people.find((item) => item.id === meeting.personId); const deal = deals.find((item) => item.id === meeting.dealId); return <article className="calendar-event" key={meeting.id}><div className="calendar-date"><strong>{new Date(`${meeting.date}T12:00:00Z`).getUTCDate()}</strong><span>{new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(`${meeting.date}T12:00:00Z`))}</span></div><div className="calendar-event-main"><div className="calendar-event-copy"><strong>{meeting.title}</strong><p>{person?.name} · {deal?.name ?? "Person meeting"}</p><div className="calendar-event-meta"><span className={`calendar-source ${meeting.source === "Google Calendar" ? "google" : ""}`}>{meeting.source}</span><span>{meeting.time}</span></div></div><div className="calendar-event-actions"><span className={`meeting-status ${meeting.status === "no-show" ? "no-show" : meeting.status === "past" ? "past" : ""}`}>{meeting.status === "no-show" ? "No-show" : meeting.status === "past" ? "Past" : "Upcoming"}</span><button className="calendar-no-show" disabled={meeting.status === "no-show"} onClick={() => onNoShow(meeting.id)}>{meeting.status === "no-show" ? "No-show recorded" : "No-show"}</button></div></div></article>; })}{!visible.length ? <p className="workspace-empty">No meetings match these filters.</p> : null}</div></Card></section>;
}

function OfferingsView({ offerings, deals, people, onToast }: { offerings: Offering[]; deals: Deal[]; people: Person[]; onToast: (message: string) => void }) {
  const [search, setSearch] = useState("");
  const visible = offerings.filter((offering) => `${offering.name} ${offering.sponsor} ${offering.type}`.toLowerCase().includes(search.toLowerCase().trim()));
  return <section className="workspace-view"><PageHeader eyebrow="Workspace / Offerings" title="Investment offerings" subline="See which investment pages were shared, who accessed them, what documents they viewed, and how each person responded." actions={<button className="primary-button" type="button" onClick={() => onToast("Offering creation is ready for connected data")}>＋ New offering</button>} /><Card title="What Offerings tracks"><div className="offering-summary"><div><strong>Access</strong><small>Whether the person opened the offering page.</small></div><div><strong>Feedback</strong><small>Thumbs up, thumbs down, or Invested.</small></div><div><strong>Documents viewed</strong><small>Which offering documents they opened.</small></div><div><strong>Related Deal</strong><small>The exchange or cash investment it supports.</small></div></div></Card><Card title="Offering activity" actions={<span className="directory-count">{visible.length} offerings</span>}><div className="workspace-toolbar"><div className="workspace-controls"><input className="directory-search" type="search" placeholder="Search offerings or sponsors…" value={search} onChange={(event) => setSearch(event.target.value)} /></div></div><div className="record-table-wrap"><table className="record-table offerings-table"><thead><tr><th>Investment offering</th><th>Person</th><th>Related Deal</th><th>Access</th><th>Feedback</th><th>Documents viewed</th></tr></thead><tbody>{visible.map((offering) => <tr key={offering.id}><td><a className="offering-link" href={offering.url} target="_blank" rel="noreferrer">Open offering page ↗</a><strong>{offering.name}</strong><small>{offering.sponsor} · {offering.type}</small></td><td>{people.find((person) => person.id === offering.personId)?.name}</td><td>{deals.find((deal) => deal.id === offering.dealId)?.name}</td><td>{offering.status}</td><td><span className={`feedback-pill ${offering.feedback === "Invested" ? "invested" : offering.feedback === "Thumbs up" ? "up" : "down"}`}>{offering.feedback}</span></td><td className="doc-list">{offering.viewed.join(" · ")}</td></tr>)}</tbody></table></div>{!visible.length ? <p className="workspace-empty">No offerings match your search.</p> : null}</Card></section>;
}

function ReportsView({ people, deals, onToast }: { people: Person[]; deals: Deal[]; onToast: (message: string) => void }) {
  const completed = deals.filter((deal) => deal.stage === "Closed").length;
  const max = Math.max(1, ...DEAL_STAGES.map((stage) => deals.filter((deal) => deal.stage === stage).length));
  return <section className="workspace-view"><PageHeader eyebrow="Manage / Reports" title="Reports" subline="Conversion, stage history, and the audit trail for the CRM." actions={<button className="outline-button" type="button" onClick={() => onToast("Report export prepared")}>Export report</button>} /><div className="report-grid"><div className="report-stat"><span>People</span><strong>{people.length}</strong><small>Total contacts</small></div><div className="report-stat"><span>Open Deals</span><strong>{deals.length - completed}</strong><small>Not closed</small></div><div className="report-stat"><span>Completed Deals</span><strong>{completed}</strong><small>Historical and current</small></div><div className="report-stat"><span>Conversion</span><strong>{Math.round((completed / deals.length) * 100)}%</strong><small>Closed / total</small></div></div><div className="dashboard-columns"><Card title="Deal stage funnel"><div className="report-funnel">{DEAL_STAGES.map((stage) => { const count = deals.filter((deal) => deal.stage === stage).length; return <div className="report-funnel-row" key={stage}><span>{stage}</span><div className="report-funnel-bar"><span style={{ width: `${(count / max) * 100}%` }} /></div><strong>{count}</strong></div>; })}</div></Card><Card title="Conversion & history"><div className="audit-list">{AUDIT_LOG.map((entry) => <div className="audit-item" key={`${entry.time}-${entry.action}`}><time>{entry.time}</time><div><strong>{entry.action}</strong><small>{entry.record} · {entry.details}</small></div></div>)}</div></Card></div><Card title="Audit log"><div className="audit-list">{AUDIT_LOG.map((entry) => <div className="audit-item" key={`${entry.time}-${entry.record}`}><time>{entry.time}</time><div><strong>{entry.action}</strong><small>{entry.record} · {entry.details}</small></div></div>)}</div></Card></section>;
}

function SettingsView({ stages, statuses, onStageAdd, onStageRemove, mobilePreview, setMobilePreview, onToast }: { stages: string[]; statuses: string[]; onStageAdd: (kind: "deal" | "person", value: string) => void; onStageRemove: (kind: "deal" | "person", value: string) => void; mobilePreview: boolean; setMobilePreview: (value: boolean) => void; onToast: (message: string) => void }) {
  const [newDealStage, setNewDealStage] = useState("");
  const [newPersonStatus, setNewPersonStatus] = useState("");
  function add(kind: "deal" | "person") { const value = kind === "deal" ? newDealStage : newPersonStatus; if (!value.trim()) return; onStageAdd(kind, value.trim()); if (kind === "deal") setNewDealStage(""); else setNewPersonStatus(""); }
  return <section className="workspace-view"><PageHeader eyebrow="Manage / Settings" title="Settings" subline="Configure CRM behavior and review the services that will power the connected version." /><Card title="Connections"><div className="connection-grid">{[["Gmail", "Historical email sync", "Not connected"], ["Cal.com", "Meeting sync", "Not connected"], ["Google Calendar", "External meetings", "Not connected"], ["Google Drive", "Folder links", "Link-only demo"], ["Google Contacts", "Contact matching", "Not connected"], ["Constant Contact", "Contact export", "Not connected"]].map(([name, description, status]) => <div className="connection-card" key={name}><div><strong>{name}</strong><small>{description}</small></div><span className={`connection-status ${status === "Link-only demo" ? "demo" : ""}`}>{status}</span></div>)}</div><p className="placeholder-note">Connection buttons will be added when the external integrations are wired up.</p></Card><Card title="Configurable statuses & stages"><div className="stage-config"><div className="stage-config-column"><h3>Person Status</h3><div className="stage-chip-list">{statuses.map((status) => <span className="stage-chip" key={status}>{status}<button type="button" onClick={() => onStageRemove("person", status)} aria-label={`Remove ${status}`}>×</button></span>)}</div><div className="stage-add"><input placeholder="Add person status" value={newPersonStatus} onChange={(event) => setNewPersonStatus(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") add("person"); }} /><button type="button" onClick={() => add("person")}>Add</button></div></div><div className="stage-config-column"><h3>Deal Stages</h3><div className="stage-chip-list">{stages.map((stage) => <span className="stage-chip" key={stage}>{stage}<button type="button" onClick={() => onStageRemove("deal", stage)} aria-label={`Remove ${stage}`}>×</button></span>)}</div><div className="stage-add"><input placeholder="Add Deal stage" value={newDealStage} onChange={(event) => setNewDealStage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") add("deal"); }} /><button type="button" onClick={() => add("deal")}>Add</button></div></div></div></Card><Card title="Mobile-friendly preview"><div className="setting-row"><div className="setting-copy"><strong>Preview CRM at phone width</strong><small>Useful for checking responsive layouts before the mobile app or PWA is built.</small></div><button className="outline-button" type="button" onClick={() => { setMobilePreview(!mobilePreview); onToast(mobilePreview ? "Exited mobile preview" : "Mobile preview enabled"); }}>{mobilePreview ? "Exit mobile preview" : "View mobile preview"}</button></div></Card><Card title="API & webhooks"><div className="api-endpoint"><code>https://api.baker1031.com/v1/crm/events</code><button className="outline-button" type="button" onClick={() => onToast("API endpoint copied")}>Copy</button></div><div className="event-tags"><span className="event-tag">person.created</span><span className="event-tag">deal.updated</span><span className="event-tag">task.completed</span><span className="event-tag">meeting.no_show</span></div><p className="placeholder-note">Future system placeholder. Authentication, signatures, retries, and delivery logs still need to be wired.</p></Card><Card title="Audit log"><div className="audit-list">{AUDIT_LOG.slice(0, 4).map((entry) => <div className="audit-item" key={`${entry.time}-${entry.action}`}><time>{entry.time}</time><div><strong>{entry.action}</strong><small>{entry.record} · {entry.details}</small></div></div>)}</div></Card></section>;
}

function AccountView({ onToast }: { onToast: (message: string) => void }) {
  return <section className="workspace-view"><PageHeader eyebrow="Manage / Account" title="Account" subline="Manage your Baker 1031 CRM profile and current session." /><Card title="Profile" actions={<button className="icon-button" type="button" onClick={() => onToast("Account editing is coming next")}>Edit</button>}><div className="profile-card"><span className="profile-avatar">JB</span><div><strong>Jerry Baker</strong><small>Administrator · Baker 1031</small></div></div><hr className="section-rule" /><dl className="field-grid"><div className="field"><dt>Role</dt><dd>Administrator</dd></div><div className="field"><dt>Workspace</dt><dd>Baker 1031 CRM</dd></div><div className="field"><dt>Access</dt><dd>Full workspace access</dd></div><div className="field"><dt>Session</dt><dd>Protected demo session</dd></div></dl></Card><Card title="Security"><div className="settings-list"><div className="setting-row"><div className="setting-copy"><strong>Password protection</strong><small>Temporary demo password is enabled.</small></div><span className="connection-status demo">Enabled</span></div><div className="setting-row"><div className="setting-copy"><strong>Two-factor authentication</strong><small>Production authentication still needs to be connected.</small></div><button className="outline-button" type="button" onClick={() => onToast("Two-factor authentication setup is reserved for production auth")}>Configure</button></div></div></Card></section>;
}

function Modal({ kind, draft, setDraft, people, stages, onClose, onSubmit }: { kind: ModalKind; draft: Record<string, string>; setDraft: (draft: Record<string, string>) => void; people: Person[]; stages: string[]; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  if (!kind) return null;
  const isContact = kind === "contact";
  const isTask = kind === "task";
  const isDeal = kind === "deal" || kind === "edit-deal";
  const title = isContact ? "Add contact" : isTask ? "Add task" : kind === "edit-deal" ? "Edit Deal" : "Add opportunity / exchange";
  return <div className="modal-backdrop open" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><h2 id="modal-title">{title}</h2><button className="modal-close" type="button" onClick={onClose} aria-label="Close dialog">×</button></div><form onSubmit={onSubmit}><div className="modal-body"><div className="modal-form-grid">{isContact ? <><FormField label="Name" value={draft.name ?? ""} onChange={(value) => setDraft({ ...draft, name: value })} required /><FormField label="Role" value={draft.role ?? ""} onChange={(value) => setDraft({ ...draft, role: value })} /><FormField label="State" value={draft.state ?? ""} onChange={(value) => setDraft({ ...draft, state: value })} /><FormField label="Email" value={draft.email ?? ""} onChange={(value) => setDraft({ ...draft, email: value })} type="email" /></> : isTask ? <><FormField label="Task" value={draft.title ?? ""} onChange={(value) => setDraft({ ...draft, title: value })} required /><FormField label="Due date" value={draft.dueDate ?? "2026-07-20"} onChange={(value) => setDraft({ ...draft, dueDate: value })} type="date" /><SelectField label="Person" value={draft.personId ?? ""} onChange={(value) => setDraft({ ...draft, personId: value })} options={people.map((person) => ({ value: person.id, label: person.name }))} /><SelectField label="Deal" value={draft.dealId ?? ""} onChange={(value) => setDraft({ ...draft, dealId: value })} options={[]} /></> : isDeal ? <><FormField label="Investment offering / exchange" value={draft.name ?? ""} onChange={(value) => setDraft({ ...draft, name: value })} required /><SelectField label="Type" value={draft.type ?? "1031 exchange"} onChange={(value) => setDraft({ ...draft, type: value })} options={[{ value: "1031 exchange", label: "1031 exchange" }, { value: "Cash investment", label: "Cash investment" }]} /><SelectField label="Person" value={draft.personId ?? ""} onChange={(value) => setDraft({ ...draft, personId: value })} options={people.map((person) => ({ value: person.id, label: person.name }))} /><SelectField label="Deal stage" value={draft.stage ?? stages[0]} onChange={(value) => setDraft({ ...draft, stage: value })} options={stages.map((stage) => ({ value: stage, label: stage }))} /><FormField label="Key date" value={draft.keyDate ?? "2026-08-15"} onChange={(value) => setDraft({ ...draft, keyDate: value })} type="date" /><FormField label="Equity" value={draft.equity ?? "0"} onChange={(value) => setDraft({ ...draft, equity: value })} type="number" /><FormField label="Debt" value={draft.debt ?? "0"} onChange={(value) => setDraft({ ...draft, debt: value })} type="number" /></> : null}</div><p className="modal-note">This native Next.js form saves placeholder data in the current session. Connected persistence will replace it later.</p></div><div className="modal-actions"><button className="outline-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save placeholder</button></div></form></section></div>;
}

function FormField({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <div className="form-field"><label>{label}</label><input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} /></div>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return <div className="form-field"><label>{label}</label><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Select…</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>;
}

export default function CrmApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [view, setView] = useState<CrmView>("people");
  const [people, setPeople] = useState(PEOPLE);
  const [deals, setDeals] = useState(DEALS);
  const [tasks, setTasks] = useState(TASKS);
  const [meetings, setMeetings] = useState(MEETINGS);
  const [stages, setStages] = useState(DEAL_STAGES);
  const [statuses, setStatuses] = useState(PERSON_STATUSES);
  const [selectedPersonId, setSelectedPersonId] = useState("eric");
  const [selectedDealId, setSelectedDealId] = useState("canyon-ridge");
  const [globalSearch, setGlobalSearch] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<ModalKind>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedAuth = window.localStorage.getItem("baker-1031-authenticated");
    const savedStages = window.localStorage.getItem("baker-1031-deal-stages");
    const savedStatuses = window.localStorage.getItem("baker-1031-person-statuses");
    if (savedAuth === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthenticated(true);
    }
    if (savedStages) setStages(JSON.parse(savedStages));
    if (savedStatuses) setStatuses(JSON.parse(savedStatuses));
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const map: Record<string, CrmView> = { dashboard: "dashboard", people: "people", "all-people": "people", "person-record": "person", deals: "deals", "all-opportunities": "deals", "opportunity-detail": "deal", tasks: "tasks", calendar: "calendar", offerings: "offerings", reports: "reports", settings: "settings", account: "account" };
      if (map[hash]) setView(map[hash]);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    setAuthReady(true);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-preview", mobilePreview);
    return () => document.body.classList.remove("mobile-preview");
  }, [mobilePreview]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string) {
    setToast(message);
  }

  function unlock() {
    setAuthenticated(true);
    window.localStorage.setItem("baker-1031-authenticated", "true");
  }

  function navigate(nextView: CrmView, id?: string) {
    setView(nextView);
    if (nextView === "person" && id) setSelectedPersonId(id);
    if (nextView === "deal" && id) setSelectedDealId(id);
    const hash = nextView === "people" ? "all-people" : nextView === "deals" ? "all-opportunities" : nextView === "person" ? "person-record" : nextView === "deal" ? "opportunity-detail" : nextView;
    window.history.replaceState(null, "", `#${hash}`);
    setGlobalSearch("");
    setNotificationOpen(false);
  }

  function openModal(kind: ModalKind, values: Record<string, string> = {}) {
    setDraft(values);
    setModal(kind);
  }

  function submitModal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (modal === "contact") {
      const id = `${(draft.name || "new-contact").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
      const newPerson: Person = { ...PEOPLE[0], id, name: draft.name || "New contact", role: draft.role || "Contact", state: draft.state || "Not recorded", emails: draft.email ? [draft.email] : ["email@example.com"], phones: [], status: "Cold", portal: false, crsReceived: false, heat: 20, registered: "2026-07-14", lastTouch: "2026-07-14", exchangeStatus: "New registration", googleContacts: "unconfirmed", linkedin: "Search not run" };
      setPeople((current) => [...current, newPerson]);
      setModal(null);
      showToast(`${newPerson.name} added`);
      navigate("person", id);
      return;
    }
    if (modal === "task") {
      const newTask: Task = { id: `task-${Date.now()}`, title: draft.title || "Follow up", dueDate: draft.dueDate || "2026-07-20", priority: "Normal", personId: draft.personId || selectedPersonId, dealId: draft.dealId || undefined, done: false };
      setTasks((current) => [newTask, ...current]);
      setModal(null);
      showToast("Task added and linked to its record");
      return;
    }
    if (modal === "edit-deal") {
      setDeals((current) => current.map((deal) => deal.id === selectedDealId ? { ...deal, name: draft.name || deal.name, stage: draft.stage || deal.stage, keyDate: draft.keyDate || deal.keyDate, equity: Number(draft.equity || deal.equity), debt: Number(draft.debt || deal.debt), total: Number(draft.equity || deal.equity) + Number(draft.debt || deal.debt), ltv: Number(draft.equity || deal.equity) + Number(draft.debt || deal.debt) ? Math.round((Number(draft.debt || deal.debt) / (Number(draft.equity || deal.equity) + Number(draft.debt || deal.debt))) * 100) : 0 } : deal));
      setModal(null);
      showToast("Deal information updated");
      return;
    }
    if (modal === "deal") {
      const equity = Number(draft.equity || 0);
      const debt = Number(draft.debt || 0);
      const newDeal: Deal = { id: `deal-${Date.now()}`, name: draft.name || "New opportunity", type: (draft.type as Deal["type"]) || "1031 exchange", personId: draft.personId || selectedPersonId, stage: draft.stage || stages[0], statusLine: "New opportunity", keyDate: draft.keyDate || "2026-08-15", keyDateLabel: "Key date", lastTouch: "2026-07-14", heat: 50, owner: "Jerry Baker", equity, debt, total: equity + debt, ltv: equity + debt ? Math.round((debt / (equity + debt)) * 100) : 0, note: "New placeholder Deal." };
      setDeals((current) => [...current, newDeal]);
      setModal(null);
      showToast("Opportunity added");
      navigate("deal", newDeal.id);
    }
  }

  function togglePerson(id: string, field: "portal" | "crsReceived") {
    setPeople((current) => current.map((person) => person.id === id ? { ...person, [field]: !person[field] } : person));
    showToast(field === "portal" ? "Investor Portal Access updated" : "CRS status updated");
  }

  function noShow(id: string) {
    setMeetings((current) => current.map((meeting) => meeting.id === id ? { ...meeting, status: "no-show" } : meeting));
    showToast("Meeting marked as a no-show");
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
    showToast("Task status updated");
  }

  function addStage(kind: "deal" | "person", value: string) {
    if (kind === "deal") { const next = stages.some((stage) => stage.toLowerCase() === value.toLowerCase()) ? stages : [...stages, value]; setStages(next); window.localStorage.setItem("baker-1031-deal-stages", JSON.stringify(next)); showToast("Deal stage added"); }
    else { const next = statuses.some((status) => status.toLowerCase() === value.toLowerCase()) ? statuses : [...statuses, value]; setStatuses(next); window.localStorage.setItem("baker-1031-person-statuses", JSON.stringify(next)); showToast("Person status added"); }
  }

  function removeStage(kind: "deal" | "person", value: string) {
    if (kind === "deal" && stages.length > 1) { const next = stages.filter((stage) => stage !== value); setStages(next); window.localStorage.setItem("baker-1031-deal-stages", JSON.stringify(next)); showToast("Deal stage removed"); }
    if (kind === "person" && statuses.length > 1) { const next = statuses.filter((status) => status !== value); setStatuses(next); window.localStorage.setItem("baker-1031-person-statuses", JSON.stringify(next)); showToast("Person status removed"); }
  }

  function exportPeople(rows: Person[], fields: string[]) {
    if (!rows.length) { showToast("Select or filter at least one person first"); return; }
    const labels: Record<string, string> = { name: "Name", role: "Role", state: "State", status: "Person status", portal: "Portal access", heat: "Heat Index", lastTouch: "Last touch" };
    const value = (person: Person, field: string) => field === "portal" ? (person.portal ? "Yes" : "No") : String(person[field as keyof Person] ?? "");
    const quote = (item: string) => `"${item.replaceAll('"', '""')}"`;
    const lines = [fields.map((field) => quote(labels[field] || field)).join(","), ...rows.map((person) => fields.map((field) => quote(value(person, field))).join(","))];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
    link.download = "baker-1031-people.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`${rows.length} people exported`);
  }

  const selectedPerson = people.find((person) => person.id === selectedPersonId) ?? people[0];
  const selectedDeal = deals.find((deal) => deal.id === selectedDealId) ?? deals[0];
  const globalResults = useMemo(() => {
    const query = globalSearch.toLowerCase().trim();
    if (!query) return [];
    return [...people.filter((person) => `${person.name} ${person.role} ${person.state}`.toLowerCase().includes(query)).map((person) => ({ id: person.id, kind: "Person", title: person.name, detail: `${person.role} · ${person.state}`, view: "person" as CrmView })), ...deals.filter((deal) => deal.name.toLowerCase().includes(query)).map((deal) => ({ id: deal.id, kind: "Deal", title: deal.name, detail: deal.stage, view: "deal" as CrmView })), ...tasks.filter((task) => task.title.toLowerCase().includes(query)).map((task) => ({ id: task.id, kind: "Task", title: task.title, detail: formatDate(task.dueDate), view: "tasks" as CrmView }))].slice(0, 8);
  }, [globalSearch, people, deals, tasks]);
  const notifications = useMemo(() => {
    const items = [...deals.filter((deal) => deal.idDeadline && daysUntil(deal.idDeadline) >= 0 && daysUntil(deal.idDeadline) <= 7).map((deal) => ({ title: "1031 deadline approaching", detail: `${deal.name} · ${formatDate(deal.idDeadline ?? "")}` })), ...deals.filter((deal) => deal.stage !== "Closed" && businessDaysSince(deal.lastTouch) >= 3).map((deal) => ({ title: "Deal needs attention", detail: `${deal.name} · untouched ${businessDaysSince(deal.lastTouch)} business days` })), ...people.filter((person) => businessDaysSince(person.lastTouch) >= 7).map((person) => ({ title: "Contact needs attention", detail: `${person.name} · untouched ${businessDaysSince(person.lastTouch)} business days` })), ...tasks.filter((task) => !task.done && daysUntil(task.dueDate) >= 0 && daysUntil(task.dueDate) <= 7).map((task) => ({ title: "Task due soon", detail: task.title }))];
    const seen = new Set<string>();
    return items.filter((item) => { const key = `${item.title}-${item.detail}`; if (seen.has(key)) return false; seen.add(key); return true; });
  }, [deals, people, tasks]);

  function renderView() {
    if (view === "dashboard") return <DashboardView people={people} deals={deals} tasks={tasks} onNavigate={navigate} onToast={showToast} />;
    if (view === "people") return <PeopleView people={people} statuses={statuses} onSelect={(id) => navigate("person", id)} onNew={() => openModal("contact")} onTogglePortal={(id) => togglePerson(id, "portal")} onToast={showToast} onExport={exportPeople} />;
    if (view === "person") return <PersonView person={selectedPerson} deals={deals} tasks={tasks} meetings={meetings} offerings={OFFERINGS} onOpenDeal={(id) => navigate("deal", id)} onOpenTask={() => openModal("task", { personId: selectedPerson.id })} onTogglePortal={(id) => togglePerson(id, "portal")} onToggleCrs={(id) => togglePerson(id, "crsReceived")} onNoShow={noShow} onToast={showToast} onToggleDone={toggleTask} />;
    if (view === "deals") return <DealsView deals={deals} people={people} stages={stages} onSelect={(id) => navigate("deal", id)} onNew={() => openModal("deal")} onToast={showToast} />;
    if (view === "deal") return <DealView deal={selectedDeal} person={people.find((person) => person.id === selectedDeal.personId) ?? selectedPerson} tasks={tasks} meetings={meetings} onBack={() => navigate("deals")} onEdit={() => openModal("edit-deal", { name: selectedDeal.name, type: selectedDeal.type, personId: selectedDeal.personId, stage: selectedDeal.stage, keyDate: selectedDeal.keyDate, equity: String(selectedDeal.equity), debt: String(selectedDeal.debt) })} onOpenPerson={() => navigate("person", selectedDeal.personId)} onOpenTask={() => openModal("task", { personId: selectedDeal.personId, dealId: selectedDeal.id })} onNoShow={noShow} onToast={showToast} onToggleDone={toggleTask} />;
    if (view === "tasks") return <TasksView tasks={tasks} people={people} deals={deals} onNew={() => openModal("task")} onToast={showToast} onToggleDone={toggleTask} />;
    if (view === "calendar") return <CalendarView meetings={meetings} people={people} deals={deals} onNoShow={noShow} onToast={showToast} />;
    if (view === "offerings") return <OfferingsView offerings={OFFERINGS} deals={deals} people={people} onToast={showToast} />;
    if (view === "reports") return <ReportsView people={people} deals={deals} onToast={showToast} />;
    if (view === "settings") return <SettingsView stages={stages} statuses={statuses} onStageAdd={addStage} onStageRemove={removeStage} mobilePreview={mobilePreview} setMobilePreview={setMobilePreview} onToast={showToast} />;
    return <AccountView onToast={showToast} />;
  }

  if (!authReady) return null;
  if (!authenticated) return <AuthGate onUnlock={unlock} />;
  return <div className="app-shell"><Sidebar view={view} navigate={navigate} onAccount={() => navigate("account")} /><main className="main" id="top"><Topbar view={view} selectedPerson={selectedPerson} selectedDeal={selectedDeal} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} results={globalResults} onResult={(result) => navigate(result.view, result.id)} notificationOpen={notificationOpen} setNotificationOpen={setNotificationOpen} notifications={notifications} onNew={() => openModal("contact")} /><div className="content">{renderView()}</div></main><Modal kind={modal} draft={draft} setDraft={setDraft} people={people} stages={stages} onClose={() => setModal(null)} onSubmit={submitModal} />{toast ? <div className="toast show" role="status">{toast}</div> : null}</div>;
}

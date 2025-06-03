# Enterprise Mission Control SaaS Platform

## Software Requirement and Architecture Document

---

## 1. Introduction

This document outlines the requirements and architecture for a Mission Control SaaS platform designed to provide intelligent services for enterprises managing their mobile device and application usage. It is intended to guide the development team, stakeholders, and reviewers throughout the lifecycle of the project.

---

## 2. Document Metadata

| Metadata            | Value                                      |
|---------------------|--------------------------------------------|
| Creator             | Nidheesh Puthalath                         |
| Reviewer            | Bharath Pasupuleti                         |
| Created Date        | 06/02/2025                                 |
| Current State       | Review                                     |

**Current State Definitions**
- **Draft**: Initial version, under development.
- **Review**: Submitted for review by stakeholders.
- **Approved**: Reviewed and approved for development.
- **Revised**: Updated version after review or changes.
- **Obsolete**: No longer in use.

---

## 3. Project Overview

### 3.1 Project Goals
Design a highly scalable, accessible, and resilient frontend system for a SaaS platform that enables enterprises to monitor, control, and secure mobile device activity via policies enforced at the edge (cell towers), supporting both real-time interaction and offline usability across varied devices and global locations.

### 3.2 Target Audience

**1. Enterprise Clients (Subscribers)**  
Organizations subscribing to the platform to manage and secure mobile connectivity and app usage at the network edge. Roles include:
- Enterprise Admins
- Security Engineers/Analysts
- Onsite Technicians
- Auditors

**2. Telecom Infrastructure Providers / Carriers**  
Stakeholders operating towers and providing device connectivity data. The integration with carriers is primarily through backend-to-backend. There is no Admin UI planned in the initial version which is considered to be a nice-to-have.

**3. Platform Internal Users**
These are internal users who are responsible for on-boarding new enterprise clients, provide support and be the point-of-contact for the enterprises. Some roles supported by the system for the internal users are -
- Customer Support/Account Managers
- Internal Admin

---

## 4. Functional Requirements

### For Enterprise Clients:
- Device Management: Tracking and management of devices and their operating systems (iOS, Android, Windows, etc.)
- Application & Action Monitoring: Detection of app usage and user actions on devices via cell tower equipment.
- Policy Enforcement: Application of enterprise-defined policies to allow or deny actions on apps based on user roles.
- Real-Time Security Dashboard:  Provide a real-time dashboard to monitor security health. This provides access to live insights on device health, policy enforcement, and security status.
- Auto-Remedial Actions: Higher subscription plans should offer auto-remedial actions enforced at cell towers.
- Tower Registration Integration: Integrate with communication real estate developers to ingest tower and carrier information.
- User/Device Onboarding: Support onboarding of existing users and devices from various sources.
- Auto-Discovery of Devices: Enable auto-discovery of new enterprise devices through cell towers.
- Internationalization Support: System should support translation of content on the UI.

### For Telecom Infrastructure Providers:
- Multi-Carrier Support: System must understand and respect each tower carrier and device compatibility.
- Tower Registration: Provide tower metadata (location, capabilities, supported OS/carriers).
- App Usage Data Feed: Forward app and usage telemetry from tower equipment to the system.

### For Platform Internal Users:
- Admin Controls: Add/update/delete policies, help enterprises with setup/troubleshooting.
- Audit Logs: Monitor rule enforcement across enterprises.
- Platform Health Dashboard: Track platform-wide health, error rates, and performance.

---

## 5. Non-Functional Requirements
Non-functional requirements of the platform which should be satisfied across all user personas
- **High Assurance**: Data isolation per enterprise, secure policy and device operations. This also ensures that the data shared by the telecom provider is securely handled, and privacy boundaries are respected.
- **Accessibility**: Interfaces usable by all enterprise staff, including those having accessibility challenges. ie. WCAG-compliant UIs
- **Performance**: Ingest app usage and device data at scale without lag from telecom providers to the platform and to the end enterprise clients.
- **Scalability**: Support hundreds(?) of enterprises and their device/user footprint.
- **Cross-Platform and form-factors**: Web, mobile and tablets of different real-estate
- **Offline Support**: Especially for field technicians
- **Global Availability**: Highly available across different regions.

---

## 6. System Architecture

### 6.1 High-Level Architecture
![Alt Text](https://github.com/nidheesh-p/ent-mission-ctrl/blob/main/ent-mission-ctrl-highlevel.jpg)

### 6.2 Frontend Architecture
![Alt Text](https://github.com/nidheesh-p/ent-mission-ctrl/blob/main/ent-mission-ctrl-frontend.jpg)

Frontend Key Components:

- **Entry Point**: `App.tsx` - bootstraps the application
- **Layout UI**: Navbars, Modals, Keyboard/ARIA support
- **Route Layer**: Role-based + private routing
- **Feature Modules**: `/devices`, `/policies`, etc. (Lazy-load feature modules)
- **Redux Store**: Global state with slices like `auth`, `deviceSlice`, etc.
- **Utils**: i18n, validation, constants etc.
- **UI Library**: Design system for reusable styled components
- **Data Layer**: RTK Query, REST API, redux offline storage

---

## 7. Data Model

### 7.1 Core Entities

**Tower**
- id, name, location, supportedOS[], supportedCarriers[], status

**Carrier**
- id, name (e.g., Verizon)

**Device**
- id, IMEI, OS, model, carrierId, userId, towerId, lastSeen

**User**
- id, name, enterpriseId, role, devices[]

**Enterprise**
- id, name, contact email, subscription_plan

**Policy**
- id, name, description, enterpriseId, rule_id

**PolicyRule**
- id, scope (device, user...), allowed_apps[], blocked_apps[]

**EventLog**
- id, deviceId, datetime, action, status

**Alert**
- id, type, severity, source, datetime, status

**RemedialAction**
- id, policyId, action, status

### 7.2 Entity Relationships

| Entity     | Relation    | Related To  |
|------------|-------------|-------------|
| Device     | 1:1         | User        |
| Device     | Many:1      | Carrier     |
| Device     | Many:1      | Tower       |
| Device     | 1:Many      | EventLog    |
| Enterprise | 1:Many      | User        |
| Policy     | 1:Many      | RemedialAction |
| Carrier    | Many:Many   | Tower       |
| Alert      | Many:1      | Device/User/Tower |

---

## 8. API Design

### 8.1 Authentication & IAM

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| POST   | /auth/login          | Exchange SSO token for JWT      |
| POST   | /auth/logout         | Invalidate session              |
| POST   | /auth/refresh_session| Refresh session JWT             |

### 8.2 Device Management

| Method | Endpoint      | Description            |
|--------|---------------|------------------------|
| GET    | /devices      | Admin to get all devices        |
| GET    | /devices/:id  | Get specific device    |
| POST   | /devices      | Register a new device    |
| PATCH  | /devices/:id  | Update the device details          |
| DELETE | /devices/:id  | Delete device          |

### 8.3 Policy & Tower APIs

| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| GET    | /towers             | List all towers       |
| GET    | /tower/:id          | Get specific tower    |
| GET    | /policies           | List policies         |
| GET    | /policies/:id       | Get a policy          |
| POST   | /policies           | Create a policy       |
| DELETE | /policies/:id       | Delete a policy       |

### 8.4 Events & Alerts

| Method | Endpoint            | Description             |
|--------|---------------------|-------------------------|
| GET    | /events?query={}    | Get filtered event logs |
| POST   | /events             | Log a new event         |
| GET    | /alerts?query={}    | Get filtered alerts     |
| PATCH  | /alerts/:id         | Update alert status     |

---

## 9. Technology Stack

### Frontend:
- TypeScript
- React
- Redux Toolkit
- redux-thunk
- redux-persist
- react-router-dom
- Babel
- Webpack
- React Testing Library
- Jest
- Styled-components

---

## 10. Data Flow Deep Dive
Example Data flow is depicted in this low-level architecture diagram. 
![diagram](https://github.com/nidheesh-p/ent-mission-ctrl/blob/main/ent-mission-ctrl-deep_dive.jpg)

### 10.1 Example: View Device List

User story:  
> As an Enterprise Admin, I want to view a list of all registered devices in my organization including their OS, carrier, and policy status.

**Flow:**

User → DevicePage and Device Table Component → RTK Query Hook(useDevices and DeviceService) → API Request(“/devices”) → Response → Redux Store(deviceSlice) → UI Re-render

1. `DevicePage.tsx` mounted
2. `useDevices()` hook triggers RTK Query `getDevices()`
3. Sends `GET /devices` API call
4. Response cached in Redux state
5. `DeviceTable` component re-renders

---

## 11. Future Considerations

- Enhanced admin analytics
- Tower/device diagnostic tools
- Improved Rolebased support


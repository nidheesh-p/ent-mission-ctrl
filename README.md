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
| Current State       | Draft                                      |

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
- Auditors (optional)

**2. Telecom Infrastructure Providers / Carriers**  
Stakeholders operating towers and providing device connectivity data. Integration is backend-to-backend (no UI in initial version).

**3. Platform Internal Users**
Internal support users including:
- Customer Support / Account Managers
- Internal Admins

---

## 4. Functional Requirements

### For Enterprise Clients:
- Device Management
- Application & Action Monitoring
- Policy Enforcement
- Real-Time Security Dashboard
- Auto-Remedial Actions
- Tower Registration Integration
- User/Device Onboarding
- Auto-Discovery of Devices
- Internationalization Support

### For Telecom Infrastructure Providers:
- Multi-Carrier Support
- Tower Metadata Registration
- App Usage Telemetry Forwarding

### For Platform Internal Users:
- Admin Controls
- Audit Logs
- Platform Health Dashboard

---

## 5. Non-Functional Requirements

- **High Assurance**: Secure, enterprise-isolated data
- **Accessibility**: WCAG-compliant UIs
- **Performance**: Real-time ingestion from telecom edge
- **Scalability**: Support for large-scale device/user footprint
- **Cross-Platform**: Web + mobile
- **Offline Support**: Especially for field technicians
- **Global Availability**: Resilient across regions

---

## 6. System Architecture

### 6.1 High-Level Architecture
![Alt Text](https://github.com/nidheesh-p/ent-mission-ctrl/blob/main/ent-mission-ctrl-highlevel.jpg)

### 6.2 Frontend Architecture
![Alt Text](https://github.com/nidheesh-p/ent-mission-ctrl/blob/main/ent-mission-ctrl-frontend.jpg)
Key modules include:

- **Entry Point**: `App.tsx` - bootstraps the application with global providers
- **Layout UI**: Navbars, Modals, Tooltips, Keyboard/ARIA support
- **Route Layer**: Role-based + private routing
- **Feature Modules**: `/devices`, `/policies`, etc.
- **Redux Store**: Global state with slices like `auth`, `deviceSlice`, etc.
- **Utils**: i18n, validation
- **UI Library**: Design system for reusable styled components
- **Data Layer**: RTK Query, REST API, local storage

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
| GET    | /devices      | Get all devices        |
| GET    | /devices/:id  | Get specific device    |
| POST   | /devices      | Register new device    |
| PATCH  | /devices/:id  | Update device          |
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

1. `DevicePage.tsx` mounted
2. `useDevices()` hook triggers RTK Query `getDevices()`
3. Sends `GET /devices` API call
4. Response cached in Redux state
5. `DeviceTable` component re-renders

---

## 11. Future Considerations

- Enhanced admin analytics
- Tower/device diagnostic tools
- Integration with telecom 5G APIs
- Improved Rolebased support


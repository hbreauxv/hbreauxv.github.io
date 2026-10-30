# Harvey Breaux

## Profile
- Title: Software Engineer / Site Reliability Engineer / DevOps
- Location: Nampa, Idaho
- Email: hbreauxv@gmail.com
- GitHub: https://github.com/hbreauxv
- LinkedIn: https://www.linkedin.com/in/harvey-b-91350192/

Software engineer with 8+ years of experience in automation, tooling development, and cloud infrastructure reliability. Builds internal tools, streamlines operational workflows, and supports cross-team collaboration across cloud-native environments.

## Skills
- Programming & automation: Python, JavaScript, Bash
- Delivery & tooling: GitHub Actions, Jenkins, CI/CD pipelines
- Infrastructure: Linux, Kubernetes, AWS, Azure, GCP
- Operations: Incident response, runbooks, API troubleshooting

## Experience

### Alkira, Inc.
- Role: Senior Software Engineer, Site Reliability Engineering
- Dates: February 2022 – Present

- Engineered an Agentic QA Agent that takes a QA test plan as input and autonomously executes tests using Playwright MCP for UI actions and SSH/internal portal access. Delegates individual tests to sub-agents to reduce inference costs and prevent context bloat during long-running executions.
- Designed and implemented an internal Python CLI that enables Operations and Escalations teams to execute multi-node commands and gather tenant-specific data with a single command.
- Built scheduled GitHub Actions workflows using Masscan to scan approximately 10,000 public-facing IPs across AWS, Azure, and GCP for exposure risks.
- Automated the build and deployment of internal tooling to AWS S3, simplifying user updates.
- Automated notifications to the on-call team when production service upgrades are deployed.
- Contributed bug fixes and features to an internal DevOps portal built with JavaScript and React.
- Served as the primary day-shift on-call engineer, maintained runbooks, manually deployed instances for key customers, and collaborated with service teams to resolve customer-impacting production issues.

### Cradlepoint · Software Engineering
- Role: Software Engineer
- Dates: October 2020 – February 2022

- Developed a Jenkins job and custom Python script using Cradlepoint's API to reduce employee DMVPN onboarding from a 2–3 hour manual process to a 3-minute job.
- Created cron jobs that auto-start critical services following outages or reboots, eliminating manual post-restart intervention in test environments.
- Improved the reliability of approximately 100 automated tests by correcting verification logic for Jupyter notebook outputs.

### Cradlepoint · Support Engineering
- Role: Support Engineer
- Dates: July 2017 – October 2020

- Served as the primary author of Cradlepoint's first API/SDK certification and customer training course, collaborating with Solutions Engineering and Education teams.
- Built a Chrome extension for direct router configuration uploads from Cradlepoint's management platform, reducing deployment time from approximately 1 hour to approximately 5 minutes.
- Used Cradlepoint's API to migrate approximately 150 CA Fire routers to a new BGP configuration with zero downtime.
- Provided advanced API/SDK troubleshooting for customer applications and developed internal Python diagnostic utilities.

## Featured work

### A test plan in. An agent takes it from there.
- Company: Alkira
- Category: Agentic QA
- Stack: Playwright MCP, SSH, Sub-agents
- Before: QA test plan
- After: Autonomous execution
- Result: Delegated test execution
- Diagram: agent

Engineered an agent that takes a QA test plan as input and autonomously executes tests using Playwright MCP for UI actions, plus SSH and internal portal access. It delegates individual tests to sub-agents to reduce inference costs and prevent context bloat during long-running executions.

### Many nodes. One command.
- Company: Alkira
- Category: Developer tooling
- Stack: Python, CLI, Operations
- Before: Multi-node workflows
- After: One command
- Result: Operational tooling
- Diagram: tooling

Designed and implemented an internal Python CLI for Operations and Escalations teams. It brings multi-node command execution and tenant-specific data gathering into a single command, streamlining operational workflows.

### Router configuration, without the wait.
- Company: Cradlepoint
- Category: Browser tooling
- Stack: Chrome Extension, Router configuration
- Before: ~1 hour
- After: ~5 minutes
- Result: Configuration deployment
- Diagram: extension

Built a Chrome extension that allows direct configuration file uploads to routers from Cradlepoint's management platform, reducing configuration deployment time from approximately an hour to approximately five minutes.

## Additional impact
- Exposure scanning: ~10,000 public IPs
- Cloud environments: AWS / Azure / GCP
- BGP migration: ~150 routers · zero downtime
- Test reliability: ~100 automated tests improved

```markdown
# AI-Driven BDD Test Generation from Jira Tickets (MCP + GitHub)

## Strategy Overview
Agentic AI (Claude/GPT‑4) via **MCP servers** connects to Jira & GitHub, analyses tickets + code diffs, and generates **BDD Gherkin scenarios** aligned with your existing Playwright‑Cucumber framework.

## Required Connections

| Component | Purpose | Example (if missing, use fallback) |
|-----------|---------|--------------------------------------|
| **Jira Dashboard** | Ticket source | `https://domain.atlassian.net/jira/software/projects/QA/boards/42`
| **GitHub Repo** | Code changes per ticket | `https://github.com/org/repo/pull/123`
| **QA Automation Repo** | Framework style & existing steps | `https://github.com/shrikantkingdom/project-phoenix/`
| **MCP Servers** | Jira & GitHub API proxies | `http://localhost:8080/jira`|

## Framework Alignment
Target: **Playwright + Cucumber (JavaScript)**  
- Feature files: `tests/features/*.feature`  
- Step definitions: `tests/step_definitions/*.steps.ts`  
- Page objects: `pages/*.page.ts`  
- Tags: `@smoke`, `@regression`, `@ticket-<ID>`

### Example Existing Scenario (reference)
```gherkin
@smoke @ticket-AUTH-123
Scenario: Successful login
  Given I am on the login page
  When I enter username "test@example.com" and password "secure123"
  And I click the login button
  Then I should see the dashboard
```

## AI Meta‑Prompt (Core Instructions)
```
For each Jira ticket (via MCP):
1. Extract description, acceptance criteria, linked GitHub PR.
2. Fetch code diff (MCP GitHub).
3. Identify new UI/API logic.
4. Generate BDD scenarios covering ACs + edge cases.
5. Output .feature snippets reusing existing step definitions.
6. Propose new step definitions only when necessary.
```


## Output
- **Jira comment** with summary + link to PR  
- **Quality score** (0–100%) based on ticket completeness & code alignment  

```
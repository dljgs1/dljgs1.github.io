## ADDED Requirements

### Requirement: Each subpage has an independent URL
The system SHALL assign each subpage its own stable URL based on a dedicated page directory so that the subpage can be accessed directly without first visiting the home page.

#### Scenario: Visitor opens a subpage URL directly
- **WHEN** a visitor navigates to a valid subpage URL such as `/pages/draw-and-guess/`
- **THEN** the system loads that subpage directly
- **THEN** the subpage content is available without requiring intermediate navigation from `/`

### Requirement: Subpages use directory-based routing
The system SHALL organize subpages using directory-based routes with each page served from its own `index.html` under a page-specific folder.

#### Scenario: New subpage is added to the site
- **WHEN** a maintainer creates a new subpage folder under the agreed subpage directory
- **THEN** the resulting page has a dedicated route derived from that folder
- **THEN** the route is compatible with static hosting that maps directories to pages

### Requirement: Subpages provide a return path to the home page
The system SHALL provide a visible navigation path from each subpage back to the site home page.

#### Scenario: Visitor wants to return from a subpage
- **WHEN** a visitor is viewing any subpage
- **THEN** the page exposes a clear control or link that navigates back to `/`

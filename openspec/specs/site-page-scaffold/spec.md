## Purpose

Define the shared scaffold and asset boundaries that make the home page and subpages extensible without mixing unrelated page logic.

## ADDED Requirements

### Requirement: Site defines a reusable page scaffold
The system SHALL define a reusable page scaffold for the home page and subpages so that new pages can follow a consistent document structure, shared assets pattern, and navigation model.

#### Scenario: Maintainer creates a new subpage
- **WHEN** a maintainer adds a new subpage to the site
- **THEN** the page can be created using the documented shared scaffold conventions
- **THEN** the page aligns with the same overall structure used by existing pages

### Requirement: Shared assets are separated from page-specific assets
The system SHALL organize shared site resources separately from page-specific resources so that common assets can be reused and page-specific code stays isolated.

#### Scenario: Site loads shared and page-specific resources
- **WHEN** a page is implemented under the new structure
- **THEN** shared resources are loaded from a common asset location
- **THEN** page-specific logic or styling can be loaded independently without changing unrelated pages

### Requirement: Adding a new subpage follows a bounded process
The system SHALL support adding a new subpage by combining a new page directory with a corresponding home page card entry, without requiring a redesign of the site structure.

#### Scenario: Maintainer extends the site with another page
- **WHEN** a maintainer wants to publish a new subpage
- **THEN** the maintainer can do so by adding the page under the agreed directory structure
- **THEN** the page becomes discoverable from the home page after adding its card metadata

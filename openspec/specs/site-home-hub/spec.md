## Purpose

Define the home page as the primary site hub and the single place where subpages are indexed and entered.

## ADDED Requirements

### Requirement: Home page serves as the site hub
The system SHALL provide a root home page at `/` that acts as the primary entry point for the site and SHALL not embed the full interactive logic of any subpage feature.

#### Scenario: Visitor opens the root page
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays the site home page as the main hub
- **THEN** the page presents overview content for the site instead of directly running the draw-and-guess game

### Requirement: Home page lists subpages as ordered cards
The system SHALL display subpage entries on the home page as cards in a deterministic order defined by site configuration.

#### Scenario: Home page renders available subpages
- **WHEN** the home page is loaded
- **THEN** the system renders a card list for available subpages
- **THEN** each card appears in the configured sequence rather than an arbitrary order

### Requirement: Each subpage card exposes essential metadata
The system SHALL display, for each subpage card, at minimum a title, a short description, and a link target that opens the subpage.

#### Scenario: Visitor reviews a subpage card
- **WHEN** a card is shown on the home page
- **THEN** the visitor can identify what the subpage is for from its visible title and summary
- **THEN** the visitor can activate a link or equivalent control to enter the subpage

## Purpose

Define the independent draw-and-guess subpage, including its prompt generation, page-level data source, and single-choice interaction.

## ADDED Requirements

### Requirement: Draw-and-guess is hosted as an independent subpage
The system SHALL host the draw-and-guess feature on its own dedicated subpage instead of embedding the feature directly on the site home page.

#### Scenario: Visitor opens the draw-and-guess page
- **WHEN** a visitor navigates to the draw-and-guess subpage URL
- **THEN** the system displays the draw-and-guess page as a standalone experience
- **THEN** the page includes the game interface without depending on the home page to render it

### Requirement: Draw-and-guess presents random prompts by category
The system SHALL present prompt options for the configured draw-and-guess categories and SHALL choose each displayed prompt randomly from that category's available entries.

#### Scenario: Page initializes prompt buttons
- **WHEN** the draw-and-guess page loads
- **THEN** the system shows the available configured categories as prompt options
- **THEN** each option displays a randomly selected prompt from its own category dataset

### Requirement: Draw-and-guess locks selection after a prompt is chosen
The system SHALL preserve the existing single-choice interaction model where selecting one prompt marks it as chosen and prevents additional prompt choices in the same round.

#### Scenario: Player selects a prompt
- **WHEN** the player activates one available prompt option
- **THEN** the selected option is visibly marked as chosen
- **THEN** the remaining prompt options become unavailable for further selection in that round

### Requirement: Draw-and-guess uses a page-specific data source
The system SHALL source draw-and-guess prompt data from a resource dedicated to the draw-and-guess page rather than from the legacy home page script arrangement.

#### Scenario: Prompt data is loaded for the subpage
- **WHEN** the draw-and-guess page prepares its prompt options
- **THEN** it reads prompt data from a draw-and-guess-specific data source
- **THEN** the home page does not need to load the game prompt dataset to function

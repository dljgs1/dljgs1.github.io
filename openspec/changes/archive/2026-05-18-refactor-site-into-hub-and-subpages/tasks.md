## 1. Site Structure Setup

- [x] 1.1 Create the new directory structure for the home page, subpages, and shared assets.
- [x] 1.2 Define the shared page scaffold files and choose the final location for common CSS, JS, and page metadata configuration.
- [x] 1.3 Create the subpage routing layout for `pages/draw-and-guess/` so it resolves as an independent static page.

## 2. Home Hub Implementation

- [x] 2.1 Refactor the root `index.html` into a site home page that contains site overview content and no embedded draw-and-guess game logic.
- [x] 2.2 Add a configuration-driven card list for subpages on the home page, including title, summary, order, and target link metadata.
- [x] 2.3 Implement the home page rendering needed to display subpage cards in deterministic order and allow navigation into each subpage.

## 3. Draw-and-Guess Subpage Migration

- [x] 3.1 Create the standalone draw-and-guess page under `pages/draw-and-guess/` using the shared page scaffold.
- [x] 3.2 Move the existing draw-and-guess interaction logic out of the home page and bind it to the standalone subpage.
- [x] 3.3 Extract the prompt dataset from the legacy `config.js` layout into a draw-and-guess-specific data source.
- [x] 3.4 Implement the draw-and-guess page so it loads category prompts from the dedicated data source and preserves the current single-choice lock behavior.
- [x] 3.5 Add a visible navigation path from the draw-and-guess page back to the home page.

## 4. Verification And Cleanup

- [x] 4.1 Verify that `/` loads the home hub and `/pages/draw-and-guess/` loads independently without relying on home page rendering.
- [x] 4.2 Verify that the home page card order, card metadata, and subpage links match the configured site data.
- [x] 4.3 Verify that draw-and-guess prompt randomization and selection locking still behave correctly after migration.
- [x] 4.4 Remove or stop referencing legacy files and inline logic that are no longer needed after the migration, or document any temporary retained dependency.

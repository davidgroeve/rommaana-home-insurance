# Embedded Quote Widget Implementation Plan

The goal is to allow B2B partners to configure and embed the Rommaana Quote Form into their own websites. We will provide a "Widget Customizer" in the Admin Dashboard and a dedicated standalone route for the embedded widget.

## User Review Required

> [!IMPORTANT]
> This plan involves adding a new public route `/embed` to the application. This route will be accessible via iframe.

## Proposed Changes

### Components

#### [NEW] [EmbeddedWidget.tsx](file:///c:/Rommaana_C/rommaana-home-insurance/components/EmbeddedWidget.tsx)
- A standalone wrapper for `QuoteForm`.
- Accepts URL parameters or Props for:
    - `primaryColor`: Hex code for buttons/highlights.
    - `font`: Font family (e.g., Inter, Roboto, Systems).
    - `mode`: 'light' | 'dark'.
    - `apiKey`: The partner's API key (for tracking).
- Applies these styles dynamically to the `QuoteForm`.

#### [NEW] [WidgetCustomizer.tsx](file:///c:/Rommaana_C/rommaana-home-insurance/components/WidgetCustomizer.tsx)
- A UI component for the Admin/B2B panel.
- **Controls**:
    - Color Picker (for Primary Color).
    - Toggle (Light/Dark Mode).
    - Dropdown (Font Family).
- **Preview Area**: Renders `EmbeddedWidget` live with current settings.
- **Code Block**: detailed `<iframe>` snippet generation.

### Pages / Routing

#### [MODIFY] [App.tsx](file:///c:/Rommaana_C/rommaana-home-insurance/App.tsx)
- Add conditional rendering to check if the path is `/embed`.
- If `/embed`, render *only* the `EmbeddedWidget` (bypass Header/Footer).
- Ensure `LanguageContext` is still wrapped.

#### [MODIFY] [B2BManagement.tsx](file:///c:/Rommaana_C/rommaana-home-insurance/components/B2BManagement.tsx)
- Add a "Widget" button to the Actions column for each API Key.
- Clicking it opens the `WidgetCustomizer` modal for that specific key.

## Verification Plan

### Automated Tests
- None (UI/Visual feature).

### Manual Verification
1.  **Open Admin Dashboard**: Go to B2B Partners tab.
2.  **Open Customizer**: Click "Widget" on an active key.
3.  **Test Controls**:
    - Change Color -> Verify button colors in preview update.
    - Change Mode -> Verify background/text colors invert.
    - Change Font -> Verify text style changes.
4.  **Verify Embed Route**:
    - Copy the generated iframe URL.
    - Open it in a new browser tab.
    - Verify it loads pure widget without the main site header/footer.

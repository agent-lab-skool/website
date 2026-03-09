# Lead Magnet Guidelines

These guides are the primary lead magnets for Agent Lab. Every guide lives as a JSON file in this directory and gets rendered at `/guides/[slug]`. The goal: give real value upfront, then naturally drive readers to the full course on Skool.

## Purpose

A lead magnet guide should make the reader think: "If the free stuff is this good, the paid course must be insane." It's not a teaser. It's a complete, useful resource that stands on its own.

## Structure

Each guide has built-in CTA placements that are automatically inserted:

1. **SubtleCta** - After the first section. A soft inline mention linking to the course.
2. **MidCta** - Around the middle. A boxed callout referencing the video walkthrough.
3. **BottomCta** - After all content. Heading + pain-point copy + course screenshot + button.
4. **FinalCta** - The main "Watch the full course" button (centered, prominent).
5. **Testimonials** - Social proof from real members, shown after the CTA button.

You don't add CTAs in the JSON. They're injected automatically by `guide-content.tsx`.

## Writing Guidelines

### Give real value
- The guide should teach something concrete and actionable. Real configs, real code, real workflows.
- Readers should be able to follow along and get a result just from the guide.
- No gatekeeping. Don't hold back the good stuff to force a click.

### Tie back to the course naturally
- The guide covers ONE workflow or topic. The course covers the full picture.
- Frame the course as "going deeper" or "seeing it all in action," not as the missing piece.
- The reader should feel like they got value AND want more, not like they got half a tutorial.

### Hit the pain point (without being dramatic)
- The reader found this guide because they want to learn AI tools and not fall behind.
- Acknowledge that AI is moving fast and most people are stuck reading instead of building.
- Position the course as the shortcut: skip the confusion, go straight to building.
- Don't be doomer. Don't say "you'll be replaced." Say "the people learning now will have an edge."

### Copy tone
- Conversational, direct, no fluff.
- Write like you're explaining to a smart friend, not lecturing.
- No em dashes (project rule). Use commas, periods, or restructure.
- Short paragraphs. One idea per paragraph.

## JSON Schema

```json
{
  "slug": "your-guide-slug",
  "title": "Guide Title",
  "description": "One-line description for the card on /guides",
  "date": "YYYY-MM-DD",
  "intro": "A short paragraph introducing the guide topic.",
  "sections": [
    {
      "emoji": "optional emoji",
      "heading": "Section Heading",
      "blocks": [
        { "type": "text", "content": "Paragraph text" },
        { "type": "code", "content": "code here", "language": "bash" },
        { "type": "heading3", "content": "Sub-heading" },
        { "type": "bullet", "items": ["Item 1", "Item 2"] },
        { "type": "link", "text": "Link text", "url": "https://..." },
        { "type": "image", "url": "https://...", "caption": "Optional caption" }
      ]
    }
  ],
  "example": { "same shape as a section, optional" },
  "proTips": [
    { "title": "Tip title", "body": "Tip explanation" }
  ]
}
```

## Checklist for a new guide

- [ ] Does it teach something complete and actionable?
- [ ] Can someone follow along and get a result without the course?
- [ ] Does the topic naturally connect to a course on Skool?
- [ ] Is the copy conversational and direct (no fluff, no em dashes)?
- [ ] Is the slug URL-friendly and descriptive?
- [ ] Does the description work as a card preview on `/guides`?

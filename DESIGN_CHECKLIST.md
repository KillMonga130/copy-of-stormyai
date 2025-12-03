# Premium Design Checklist

Use this checklist before shipping any feature to ensure it maintains premium quality.

## Visual Quality

### Spacing & Layout
- [ ] All spacing uses 8-point system (8, 16, 24, 32, 40, 48, 64, 80, 96)
- [ ] No random pixel values (e.g., 13px, 27px)
- [ ] Grid alignment is perfect - no drifting elements
- [ ] Consistent padding across similar components
- [ ] Proper breathing room between sections

### Typography
- [ ] Font family is consistent (Inter)
- [ ] Font weights are intentional (400 for body, 500 for medium, 600 for headings)
- [ ] Line heights follow system (1.25 tight, 1.5 normal, 1.625 relaxed)
- [ ] Text hierarchy is clear
- [ ] No overly bold or overly light text

### Colors
- [ ] Using defined color palette only
- [ ] High contrast for readability
- [ ] No neon effects or random gradients
- [ ] Accent colors reinforce hierarchy
- [ ] Consistent color usage across components

### Components
- [ ] All border radiuses are 8px
- [ ] Buttons share same height (40px standard, 48px large, 32px small)
- [ ] Cards use consistent shadow style
- [ ] Icons are same size within context
- [ ] Form inputs have consistent styling

## Interaction Quality

### Loading States
- [ ] Every button shows loading state during async operations
- [ ] Loading text is clear ("Processing...", "Searching...")
- [ ] Button is disabled during loading
- [ ] Skeleton screens for data-heavy sections
- [ ] No frozen UI during operations

### Feedback
- [ ] Success actions show confirmation
- [ ] Errors display helpful messages
- [ ] Notifications auto-dismiss
- [ ] Form validation is real-time
- [ ] Hover states are subtle

### Animations
- [ ] Transitions are 0.15s (quick and responsive)
- [ ] No aggressive bouncing or wiggling
- [ ] Animations serve a purpose
- [ ] No layout shifts during animation
- [ ] Smooth, natural easing

## Functional Quality

### Forms
- [ ] All inputs have labels
- [ ] Placeholders provide examples
- [ ] Validation shows clear errors
- [ ] Submit buttons show loading state
- [ ] Forms reset after successful submission

### Modals
- [ ] Close on backdrop click
- [ ] Close on Escape key
- [ ] Focus traps inside modal
- [ ] Body scroll locks when open
- [ ] Smooth open/close transitions

### Navigation
- [ ] All links work
- [ ] Active states are clear
- [ ] Smooth scrolling for anchors
- [ ] Keyboard accessible
- [ ] Mobile menu works properly

## Content Quality

### Copy
- [ ] Specific, not generic ("Find tech reviewers" not "Build your dreams")
- [ ] Clear value proposition
- [ ] No buzzword stacking
- [ ] Professional tone
- [ ] Correct grammar and spelling

### Meta Tags
- [ ] Page title is descriptive
- [ ] Meta description is compelling
- [ ] OG image exists and looks good
- [ ] Twitter cards configured
- [ ] Favicon is present

### Accessibility
- [ ] Semantic HTML elements
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

## Technical Quality

### Performance
- [ ] No unnecessary re-renders
- [ ] Images are optimized
- [ ] CSS is minimal
- [ ] JavaScript is efficient
- [ ] No console errors

### Responsiveness
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1200px+)
- [ ] No horizontal scroll
- [ ] Touch targets are 44px minimum

### Browser Support
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Graceful degradation for older browsers

## Red Flags to Avoid

### Visual Red Flags
- ❌ Purple gradient hero sections (unless brand color)
- ❌ Sparkle emoji everywhere
- ❌ Hover animations on every card
- ❌ Emojis as UI elements
- ❌ Fake testimonials
- ❌ Non-functional social icons
- ❌ Massive icons with tiny text
- ❌ Semi-transparent headers with poor contrast
- ❌ Bad animations (wiggle, bounce overshoot)

### Structural Red Flags
- ❌ No loading states
- ❌ Inconsistent component placement
- ❌ Slow server actions with no feedback
- ❌ Misaligned grids
- ❌ Too many different border radiuses
- ❌ Random spacing values

### Content Red Flags
- ❌ "All right reversed" (typo in copyright)
- ❌ Meaningless taglines
- ❌ Overloaded hero sections
- ❌ Generic placeholder text left in

### Technical Red Flags
- ❌ Missing meta tags
- ❌ Broken responsiveness
- ❌ Non-functional interactive elements
- ❌ No OG image
- ❌ Placeholder text in production

## Shipping Checklist

Before deploying:
1. [ ] Run through entire checklist above
2. [ ] Test all user flows
3. [ ] Check mobile experience
4. [ ] Verify loading states work
5. [ ] Test form submissions
6. [ ] Check console for errors
7. [ ] Validate HTML/CSS
8. [ ] Test keyboard navigation
9. [ ] Preview OG image in social share
10. [ ] Get feedback from another person

## The Premium Standard

A premium site feels:
- **Calm**: No visual chaos or aggressive animations
- **Clear**: Every element has obvious purpose
- **Consistent**: Components feel like they belong together
- **Responsive**: Immediate feedback for every action
- **Professional**: Attention to detail in every pixel
- **Intentional**: Every choice is deliberate, not rushed

If something feels "off" or "rushed", it probably is. Trust your instincts and refine until it feels right.

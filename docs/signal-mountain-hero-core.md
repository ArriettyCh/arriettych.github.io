# Signal Mountain Hero Core Logic

## What This Hero Is

This hero should be understood as:

"a mountain made of living light particles, rendered in ASCII"

not:

"an ASCII mountain with some motion effects added afterwards"

That distinction matters, because the motion logic should come from particle behavior, while the final visual language should come from characters on a fixed grid.

## Core Objective

The final result should feel like:

- a real particle mountain with mass
- a mountain that is solid, not just a bright contour or a band
- a ridge that constantly sheds, re-forms, and breathes
- a world where stray characters can appear anywhere, but become rarer farther from the mountain
- a title that rises from the mountain instead of sitting on top of it

## Non-Negotiable Constraints

- Final output is ASCII only.
- Characters live on a fixed grid after layout is built.
- A grid cell can output at most one character per frame.
- The mountain must read as a solid body, not a hollow outline and not a thin strip.
- The title must belong to the same grid system as the mountain.
- Scroll and pointer interactions must not hijack native page interaction.
- The hero must not add a second layer of heavy damping on top of the site's existing smooth scrolling.
- If title motion needs extra treatment, title logic may differ from mountain logic, but it still must not feel sluggish.

## The Right Mental Model

Use two layers of logic:

### 1. Invisible motion layer

This layer is responsible for behavior.

It determines:

- where the mountain wants to exist
- how particles drift
- how the ridge emits and reabsorbs particles
- how scroll and pointer disturb the system
- how the title emerges

This layer should feel like light-particle behavior, not like a texture effect.

### 2. Visible ASCII layer

This layer is responsible for appearance.

It determines:

- where characters can appear
- which character a cell shows
- how bright or dense that cell feels
- how title and mountain share the same grid

This layer should feel like a field of real characters, not like one large image with text baked into it.

## The Most Important Visual Rule

The mountain needs both:

- a solid interior mass
- a lively, unstable edge

If only the edge is active, the mountain becomes hollow.
If only the interior exists, the mountain becomes dead.

So the correct structure is:

- a stable body component that fills the mountain volume
- a more active edge component that handles shimmer, overflow, and escape
- sparse stray particles outside the body that make the world feel alive

## How the Mountain Should Work

The mountain should be maintained by a shape field or attractor, so that particles collectively preserve a mountain silhouette.

The key idea is:

- the body preserves the mountain's overall mass
- the ridge is the most unstable and active region
- some particles can escape
- escaped particles can fade, drift, and sometimes rejoin

This creates the feeling of a mountain made from luminous organisms or fireflies rather than a hard geometric object.

## How the ASCII Effect Should Work

The visible image should come from a fixed character grid.

That means:

- character positions do not move
- the illusion of motion comes from which cells become active, how strongly they glow, and which character they choose
- the world should feel like animated ASCII matter, not like text being translated around the screen

The important part is not "randomly change characters".
The important part is:

- particles and fields decide where energy exists
- the grid converts that energy into characters

## How to Think About Character Flow

The particle flow effect in ASCII should come from energy moving through a fixed grid.

Visually, this should create:

- dense, stable character clusters inside the mountain
- a more unstable ridge where characters loosen and break away
- rare isolated characters outside the body
- local disturbances that create gaps, rim-lighting, and re-aggregation

So the viewer should feel:

- the mountain is made of many small units
- those units are individually alive
- the mountain shape is collective, not rigid

## Title Logic

The title should not be an overlay that sits above the mountain.

Instead:

- the title should exist in the same character world
- it should emerge from behind or within the mountain
- title cells should participate in the same grid logic as mountain cells

The title may use its own reveal logic, but it should still obey the same overall visual language.

Important:

- title trailing is acceptable
- title sluggishness is not

If there is already smooth scrolling on the page, the title should not add another strong lag or chase behavior.
Any extra title motion should be very light and should feel like a subtle spring or lift, not a second smoothing system.

## Scroll Interaction

Scroll interaction should be additive, not competitive.

That means:

- do not capture or override the page's scrolling behavior
- do not fight the existing smooth scroll
- read the existing scroll state and react to it

The hero should use scroll as an input signal for:

- slightly increasing ridge activity
- slightly increasing particle shedding
- introducing a small responsive lift or bounce
- helping the title rise

But the hero should not feel like it has its own separate scroll engine.

## Pointer Interaction

Pointer interaction should behave like a local force field, not like direct dragging.

Good pointer behavior:

- local disturbance
- local repulsion
- brightening or thickening around the rim
- nearby particles dispersing and then cohering again

Bad pointer behavior:

- moving the whole scene
- shifting the character grid
- swallowing pointer behavior in a way that affects the page itself

The pointer should disturb the mountain, not control it.

## Character Rendering Quality

This is one of the most important implementation concerns.

The characters must feel like real characters.
They must not read as:

- a blurry layer
- a text-texture pasted over the screen
- a sticker or decal effect

If a simple text-on-canvas approach makes the result look like a bitmap, that is the wrong direction.

Acceptable directions include:

- crisp character rendering on a fixed grid
- a glyph atlas or similar character-based rendering approach
- vector-based character rendering if performance allows

The rule is:

- choose the rendering method that best preserves the feeling of discrete characters
- do not choose a method that makes the hero look like one blurred image

Performance matters, but preserving the character quality matters more than clinging to a specific implementation trick.

## What Must Be Preserved During Implementation

No matter how the effect is implemented, these qualities should remain true:

- the mountain is solid
- the ridge is alive
- particles can escape
- stray characters can exist outside the mountain
- the title rises from the same world
- characters remain characters
- scroll remains the page's scroll, not the hero's scroll

## Common Failure Modes

### 1. Hollow mountain

Cause:

- the implementation only models the ridge or the edge

Result:

- the mountain becomes a contour instead of a volume

### 2. Sticker or texture look

Cause:

- the final ASCII layer is treated like a single image instead of many discrete characters

Result:

- the viewer no longer reads the effect as living ASCII

### 3. Sluggish title

Cause:

- title position is eased or damped too heavily on top of already smooth page scroll

Result:

- the title feels disconnected from user input

### 4. Dead motion

Cause:

- the system only changes opacity or swaps characters randomly

Result:

- the mountain flickers, but does not feel inhabited

## Short Version

If this hero is rebuilt correctly, the implementation should follow this logic:

- treat the mountain as a particle-based light form
- preserve a solid interior body, not just an edge
- convert the particle behavior into ASCII on a fixed grid
- let the ridge be the most unstable and expressive area
- allow rare stray characters outside the mountain
- keep the title inside the same world and grid
- preserve the site's existing smooth scrolling and only react to it
- render characters in a way that still feels like real characters, not a pasted texture

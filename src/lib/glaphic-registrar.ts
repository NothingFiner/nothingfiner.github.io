// The site's custom-element registrar. Under the by-source @glaphic/ui
// alias the library's own package.json reads every ts module as pure
// (its sideEffects list names css files only), so served builds pruned
// the registration barrel down to the one component some site module
// also imported for a value (glaphic-wipe rode PageWipe's direct
// import) — served builds shipped an UNUPGRADED library: the strip's
// slides as raw light children, no shadow plates, no type treatment.
// Dev never saw it: the prebundle does no pruning, which is why the
// site looked right in dev and half-built when served.
//
// This file imports the library's component modules for values and
// references each one (an unused binding prunes right back). Rollup
// emits each named module, the module-scope self-registration rides
// along, and the element upgrades at runtime. The token/theme exports
// (setGlaphicTheme and friends) keep flowing through the barrel for the
// pages that read them — this file only guarantees the REGISTRATIONS.
//
// The list mirrors the site's JSX. Keep it in step when a page starts
// composing a new element.
//
// (Deliberately not inline in main.tsx: main's imports start the mount;
// the definitions must exist before any render walks a route.)

import { GlaphicAccordion } from '@glaphic/ui/components/glaphic-accordion/glaphic-accordion.js';
import { GlaphicAccordionItem } from '@glaphic/ui/components/glaphic-accordion/glaphic-accordion-item.js';
import { GlaphicAscii } from '@glaphic/ui/components/glaphic-ascii/glaphic-ascii.js';
import { GlaphicBand } from '@glaphic/ui/components/glaphic-band/glaphic-band.js';
import { GlaphicButton } from '@glaphic/ui/components/glaphic-button/glaphic-button.js';
import { GlaphicCard } from '@glaphic/ui/components/glaphic-card/glaphic-card.js';
import { GlaphicCardCarousel } from '@glaphic/ui/components/glaphic-card-carousel/glaphic-card-carousel.js';
import { GlaphicCardSlide } from '@glaphic/ui/components/glaphic-card-carousel/glaphic-card-slide.js';
import { GlaphicCast } from '@glaphic/ui/components/glaphic-cast/glaphic-cast.js';
import { GlaphicChip } from '@glaphic/ui/components/glaphic-chip/glaphic-chip.js';
import { GlaphicCorners } from '@glaphic/ui/components/glaphic-corners/glaphic-corners.js';
import { GlaphicCursorType } from '@glaphic/ui/components/glaphic-cursor-type/glaphic-cursor-type.js';
import { GlaphicDivider } from '@glaphic/ui/components/glaphic-divider/glaphic-divider.js';
import { GlaphicFan } from '@glaphic/ui/components/glaphic-fan/glaphic-fan.js';
import { GlaphicFrame } from '@glaphic/ui/components/glaphic-frame/glaphic-frame.js';
import { GlaphicMarquee } from '@glaphic/ui/components/glaphic-marquee/glaphic-marquee.js';
import { GlaphicPlate } from '@glaphic/ui/components/glaphic-plate/glaphic-plate.js';
import { GlaphicPoolMenu } from '@glaphic/ui/components/glaphic-pool-menu/glaphic-pool-menu.js';
import { GlaphicSelect } from '@glaphic/ui/components/glaphic-select/glaphic-select.js';
import { GlaphicSlider } from '@glaphic/ui/components/glaphic-slider/glaphic-slider.js';
import { GlaphicSwitch } from '@glaphic/ui/components/glaphic-switch/glaphic-switch.js';
import { GlaphicTable } from '@glaphic/ui/components/glaphic-table/glaphic-table.js';
import { GlaphicTape } from '@glaphic/ui/components/glaphic-tape/glaphic-tape.js';
import { GlaphicText } from '@glaphic/ui/components/glaphic-text/glaphic-text.js';
import { GlaphicTextfield } from '@glaphic/ui/components/glaphic-textfield/glaphic-textfield.js';
import { GlaphicWipe } from '@glaphic/ui/components/glaphic-wipe/glaphic-wipe.js';

void GlaphicAccordion; // <glaphic-accordion>
void GlaphicAccordionItem; // <glaphic-accordion-item>
void GlaphicAscii; // <glaphic-ascii>
void GlaphicBand; // <glaphic-band>
void GlaphicButton; // <glaphic-button>
void GlaphicCard; // <glaphic-card>
void GlaphicCardCarousel; // <glaphic-card-carousel>
void GlaphicCardSlide; // <glaphic-card-slide>
void GlaphicCast; // <glaphic-cast>
void GlaphicChip; // <glaphic-chip>
void GlaphicCorners; // <glaphic-corners>
void GlaphicCursorType; // <glaphic-cursor-type>
void GlaphicDivider; // <glaphic-divider>
void GlaphicFan; // <glaphic-fan>
void GlaphicFrame; // <glaphic-frame>
void GlaphicMarquee; // <glaphic-marquee>
void GlaphicPlate; // <glaphic-plate>
void GlaphicPoolMenu; // <glaphic-pool-menu>
void GlaphicSelect; // <glaphic-select>
void GlaphicSlider; // <glaphic-slider>
void GlaphicSwitch; // <glaphic-switch>
void GlaphicTable; // <glaphic-table>
void GlaphicTape; // <glaphic-tape>
void GlaphicText; // <glaphic-text>
void GlaphicTextfield; // <glaphic-textfield>
void GlaphicWipe; // <glaphic-wipe> (also direct in PageWipe — one registration)
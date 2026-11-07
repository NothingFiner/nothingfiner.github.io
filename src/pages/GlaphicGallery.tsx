// Wiring-scaffold for the new design: renders glaphic components in-site so
// we can verify the local-path dependency, tokens.css, and theme sync work
// before rebuilding actual pages on top of them.
import { useEffect } from 'preact/hooks';
import '@glaphic/ui';
import { setGlaphicTheme, glaphicTokens } from '@glaphic/ui';
import { useTheme } from '../context/ThemeContext';

const section = { marginBottom: '56px' } as const;
const h2Style = {
  fontFamily: 'var(--glaphic-font-family-mono, monospace)',
  fontSize: '11px',
  letterSpacing: '0.08em',
  color: 'var(--muted)',
  margin: '0 0 16px',
} as const;

export function GlaphicGallery() {
  const { theme } = useTheme();

  // Keep the glaphic token theme pinned to the site's toggle.
  useEffect(() => {
    setGlaphicTheme(theme);
  }, [theme]);

  return (
    <div
      class="min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--ink)', padding: '48px 24px' }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--f-disp)', fontWeight: 300, margin: '0 0 8px' }}>
          glaphicUI gallery
        </h2>
        <p style={{ fontFamily: 'var(--f-mono)', marginBottom: '48px', color: 'var(--muted)' }}>
          {glaphicTokens.length} vocabulary tokens · theme: {theme} · source-aliased
        </p>

        <section style={section}>
          <h2 style={h2Style}>TYPOGRAPHY</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            <glaphic-text style="font-size:64px">FLAT GRAPHIC REALISM</glaphic-text>
            <glaphic-cast style="font-size:28px">casting shadows on the ink</glaphic-cast>
            <glaphic-cursor-type style="font-size:18px">typing like a terminal</glaphic-cursor-type>
          </div>
        </section>

        <section style={section}>
          <h2 style={h2Style}>SURFACES</h2>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            <glaphic-card style="min-height:100px">
              <div style="padding:var(--glaphic-card-padding, 14px);font:600 12px var(--glaphic-font-family-mono, monospace)">card — default</div>
            </glaphic-card>
            <glaphic-card multiply="false" style="min-height:100px">
              <div style="padding:var(--glaphic-card-padding, 14px);font:600 12px var(--glaphic-font-family-mono, monospace)">card — opaque</div>
            </glaphic-card>
            <glaphic-frame style="min-height:100px">frame</glaphic-frame>
            <glaphic-band style="min-height:80px">band</glaphic-band>
            <glaphic-plate style="min-height:80px">plate</glaphic-plate>
            <glaphic-tape style="min-height:80px">tape</glaphic-tape>
          </div>
        </section>

        <section style={section}>
          <h2 style={h2Style}>CONTROLS</h2>
          <div style={{ display: 'grid', gap: '12px', justifyItems: 'start' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <glaphic-button>solid</glaphic-button>
              <glaphic-button variant="outline">outline</glaphic-button>
              <glaphic-button variant="text">text</glaphic-button>
              <glaphic-button color="danger">danger</glaphic-button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <glaphic-chip>line</glaphic-chip>
              <glaphic-chip variant="solid">solid</glaphic-chip>
              <glaphic-chip variant="cyan">cyan</glaphic-chip>
              <glaphic-chip variant="brand">brand</glaphic-chip>
            </div>
            <glaphic-switch />
            <glaphic-slider />
            <glaphic-textfield label="Demo field" />
            <glaphic-select />
          </div>
        </section>

        <section style={section}>
          <h2 style={h2Style}>DATA</h2>
          <glaphic-table />
          <glaphic-divider style="margin:24px 0" />
          <glaphic-accordion>
            <glaphic-accordion-item label="Wiring check">wiring check for the new-design branch</glaphic-accordion-item>
          </glaphic-accordion>
        </section>
      </div>
    </div>
  );
}
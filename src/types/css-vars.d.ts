// CSS custom properties in style={{}}: csstype has no `--*` index signature,
// so every var-bearing style object previously needed `as any`. Widening the
// CSSProperties interface once here types the API instead — a cast is the
// compiler's blindfold (typescript.md).
import 'preact';

declare module 'preact' {
  namespace JSX {
    interface CSSProperties {
      [key: `--${string}`]: string | number | undefined;
    }
  }
}
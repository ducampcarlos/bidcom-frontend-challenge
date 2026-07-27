import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// next/image validates remote hosts against next.config's `images.remotePatterns`,
// a check that only makes sense under the real Next.js runtime (dev/build/start).
// In jsdom it has nothing to validate against, so tests render a plain <img> instead.
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, priority, sizes, ...imgProps } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt as string} {...imgProps} />;
  },
}));

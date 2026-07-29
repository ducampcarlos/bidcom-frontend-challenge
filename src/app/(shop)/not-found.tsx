// Re-exported so notFound() calls inside (shop) routes resolve here, under
// this segment's own layout (with the header), instead of falling through
// to the root not-found.tsx, which renders under the header-less root layout.
export { default } from "@/app/not-found";

/**
 * Workaround to expose the correct styled-components export in ESM builds.
 *
 * When using Rollup with styled-components, the DOM helpers may be assigned to `styled.default`
 * instead of `styled`. This proxy ensures consumers can import `styled` without needing to know
 * about the bundler quirk. Please open a discussion on GitHub if you have a more robust fix:
 * https://github.com/openfort-xyz/openfort-react/discussions/new.
 */
declare const _default: import("styled-components").StyledInterface;
export default _default;

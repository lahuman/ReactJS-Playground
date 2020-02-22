export let PRIMARY_COLOR = '#0062ff';
export let LIGHT_PRIMARY_COLOR = '#e4eefe';
export let TEXT_PRIMARY_COLOR = '#1b2334';
export let TEXT_SECONDARY_COLOR = 'rgba(50, 60, 81, 0.6)';
export let BACKGROUND_COLOR = '#f7f9fc';
export let LIGHT_BORDER_COLOR = 'rgba(0, 0, 0, 0.12)';
export let APP_BAR_MINIMIZED_HEIGHT = 64;
export let APP_BAR_EXPANDED_HEIGHT = APP_BAR_MINIMIZED_HEIGHT + 56;
export let MATTE_RED = '#ee1f60';
export let MATTE_GREEN = '#36c73a';
export let $pcThumb = Symbol('$pcThumb');
export let $mobileThumb = Symbol('$mobileThumb');
export let ReactSelectTheme = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: PRIMARY_COLOR,
    primary25: LIGHT_PRIMARY_COLOR,
  },
});
export let FONT_FAMILY = `-apple-system, BlinkMacSystemFont, "Malgun Gothic",
  "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
  "Helvetica Neue", sans-serif`;

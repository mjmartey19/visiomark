import { Tabs, TabsProps, rem } from '@mantine/core';
import { THEME } from '../../../../appTheme';

export function StyledTabs(props: TabsProps) {
  return (
    <Tabs
      unstyled
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: `4px solid ${THEME.colors.background.jet}`,
          color: THEME.colors.background.jet,
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          cursor: 'pointer',
          fontSize: theme.fontSizes.sm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '1rem',

          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },

          '&:not(:first-of-type)': {
            borderLeft: 0,
          },

          

          '&[data-active]': {
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: `4px solid ${theme.white}`,
            color: theme.white,
          },
        },

        tabIcon: {
          marginRight: theme.spacing.xs,
          display: 'flex',
          alignItems: 'center',
        },

        tabsList: {
          display: 'flex',
          gap: '0.5rem',
        },
      })}
      {...props}
    />
  );
}

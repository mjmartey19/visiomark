import {
  createStyles,
  Progress,
  Box,
  Text,
  Group,
  Paper,
  SimpleGrid,
  rem,
} from '@mantine/core';
import { BsArrowUpRight } from 'react-icons/bs';
import { SiGoogleanalytics } from 'react-icons/si';
import { THEME } from '../../../../appTheme';

const useStyles = createStyles((theme) => ({
  progressLabel: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    fontSize: theme.fontSizes.sm,
  },

  stat: {
    borderBottom: `${rem(3)} solid`,
    paddingBottom: rem(5),
  },

  statCount: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.3,
  },

  diff: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}));

interface StatsSegmentsProps {
  total: string;
  diff: number;
  data: {
    label: string;
    count: number;
    part: number;
    color: string;
  }[];
}

export function StatsSegments({ total, diff, data }: StatsSegmentsProps) {
  const { classes } = useStyles();

  const segments = data.map((segment) => ({
    value: segment.part,
    color: segment.color,
    label: segment.part > 10 ? `${segment.part}%` : undefined,
  }));

  const descriptions = data.map((stat) => (
    <Box
      key={stat.label}
      sx={{ borderBottomColor: stat.color }}
      className={classes.stat}
    >
      <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
        {stat.label}
      </Text>

      <Group position="apart" align="flex-end" spacing={0}>
        <Text fw={700}>{stat.count}</Text>
        <Text c={stat.color} fw={700} size="sm" className={classes.statCount}>
          {stat.part}%
        </Text>
      </Group>
    </Box>
  ));

  return (
    <Paper p="md" radius="md"
       sx={{
            background: 'transparent',
            marginTop: '1rem',
            border: `1px solid ${THEME.colors.background.jet}`
          }}
    >
      <Group position="apart">
        <Group align="flex-end" spacing="xs">
          <Text fz="xl" fw={700} color={THEME.colors.text.primary}>
            {total}
          </Text>
          <Text c="teal" className={classes.diff} fz="sm" fw={700}>
            <span>{diff}%</span>
            <BsArrowUpRight size="1rem" style={{ marginBottom: rem(4) }} />
          </Text>
        </Group>
        <SiGoogleanalytics size="1.4rem" className={classes.icon} />
      </Group>

      <Text c="dimmed" fz="sm">
        Calculates the difficulty level of the questions based on the percentage
        of student scores.
      </Text>

      <Progress
        sections={segments}
        size={34}
        classNames={{ label: classes.progressLabel }}
        mt={40}
      />
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} mt="xl">
        {descriptions}
      </SimpleGrid>
    </Paper>
  );
}

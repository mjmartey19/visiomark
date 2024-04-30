import {
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Text,
  rem,
} from '@mantine/core';
import { BiAnalyse } from 'react-icons/bi';
import { DiGoogleAnalytics } from 'react-icons/di';
import { GrAnalytics } from 'react-icons/gr';
import { IoMdAnalytics } from 'react-icons/io';
import { BsArrowDownLeft, BsArrowDownRight } from 'react-icons/bs';

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * .1)`,
  },

  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}));

const icons = {
  totalVariance: BiAnalyse,
  average: DiGoogleAnalytics,
  minScore: GrAnalytics,
  maxScore: IoMdAnalytics,
};

interface StatsGridProps {
  data: {
    title: string;
    icon: keyof typeof icons;
    value: string | number;
    diff: number;
  }[];
}

export function StatsGrid({ data }: StatsGridProps) {
  const { classes } = useStyles();
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? BsArrowDownLeft : BsArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            color={stat.diff > 0 ? 'teal' : 'red'}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size="1rem" />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Summary on the file
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>
    </div>
  );
}

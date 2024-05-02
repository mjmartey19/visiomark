import { Button, Sx, Tooltip, packSx } from '@mantine/core';
import { THEME } from '../../../appTheme';

const GenericBtn = ({
  title,
  sx,
  onClick,
  type,
  tooltip,
}: {
  title: string;
  sx?: Sx | Sx[];
  onClick?: () => void;
  type: 'submit' | 'button';
  tooltip?: string;
}) => {
  return (
    <Tooltip label={tooltip} withArrow position="top-start">
      <Button
        sx={[
          {
            fontFamily: 'Poppins',
            fontWeight: 'bold',
          },
          ...packSx(sx),
        ]}
        type={type}
        onClick={onClick}
      >
        {title}
      </Button>
    </Tooltip>
  );
};

export default GenericBtn;

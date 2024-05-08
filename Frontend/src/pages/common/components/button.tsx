import { Button, Sx, Tooltip, packSx } from '@mantine/core';
import { THEME } from '../../../appTheme';

const GenericBtn = ({
  title,
  sx,
  onClick,
  disabled,
  type,
  tooltip,
}: {
  title: string;
  sx?: Sx | Sx[];
  onClick?: () => void;
  disabled?: boolean;
  type: 'submit' | 'button';
  tooltip?: string;
}) => {
  return (
    <Tooltip color={`${THEME.colors.background.primary}`} label={tooltip} withArrow position="top-start">
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
        disabled={disabled}
      >
        {title}
      </Button>
    </Tooltip>
  );
};

export default GenericBtn;

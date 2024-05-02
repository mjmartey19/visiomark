import { Modal, ScrollArea, createStyles } from '@mantine/core';
import { THEME } from '../../../appTheme';

const useStyles = createStyles((theme) => ({
  modal: {
    '& .mantine-Modal-header': {
      background: `${THEME.colors.background.black}`,
      padding: '0 0 1rem 0'
    },

    '& .mantine-Paper-root': {
      background: `${THEME.colors.background.black}`,
      color: `${THEME.colors.text.primary}`,
      border: `1px solid ${THEME.colors.text.primary}`,
      overflowY: 'hidden',
      padding: '1rem 2rem 4rem 2rem',
    },
  },
}));

const ModalComp = ({
  opened,
  close,
  children,
}: {
  opened: boolean;
  close: () => void;
  children: React.ReactNode;
}) => {
  const { classes } = useStyles();
  return (
    <>
      <Modal
        returnFocus={true}
        opened={opened}
        onClose={close}
        centered
        scrollAreaComponent={ScrollArea.Autosize}
        className={classes.modal}
        size={'800px'}
      >
        {children}
      </Modal>
    </>
  );
};

export default ModalComp;

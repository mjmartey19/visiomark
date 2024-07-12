import React from 'react';
import { Modal, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const NotificationModal = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Notification(0)</Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Notifications"
      >
        <Text>
          You currently have no new notifications.
        </Text>
      </Modal>
    </>
  );
};

export default NotificationModal;

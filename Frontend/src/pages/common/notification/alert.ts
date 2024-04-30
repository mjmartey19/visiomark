import { Alert, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BiErrorCircle } from 'react-icons/bi';
import { notifications } from '@mantine/notifications';

export function AppAlert({
  title,
  message,
  color,
}: {
  title: string;
  message: string;
  color: string;
}) {
  notifications.show({
    title,
    message,
    color,
    style: { background: '#FFFFF4', color: 'black' },
  });
}

export default AppAlert;

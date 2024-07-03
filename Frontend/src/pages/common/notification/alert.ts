import { BiErrorCircle, BiCheckCircle } from 'react-icons/bi'; // Import additional icons
import { notifications } from '@mantine/notifications';

export function AppAlert({
  title,
  message,
  color,
  icon,
}: {
  title: string;
  message: string;
  color: string;
  icon?: React.ReactNode;
 
  
}) {
  notifications.show({
    title,
    message,
    color,
    icon,
    style: { background: '#FFFFF4', color: 'black' },
    autoClose: 4000,

  });
}

export default AppAlert;


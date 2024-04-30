import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';
import routing from './routes';
import { Notifications } from '@mantine/notifications';

function App() {
    const [greetMsg, setGreetMsg] = useState('');
    const [name, setName] = useState('');

    async function greet() {
        setGreetMsg(await invoke('greet', { name }));
    }

    return (
        <>
            <Notifications limit={3} />
            <RouterProvider router={routing} />
        </>
    )
    
}

export default App
import About from '../../pages/About';
import Error from '../../pages/Error';
import MapPage from '../../pages/MapPage';
import RegistrationPage from '../../pages/RegistrationPage';

export const routeConfig = [
    {
        name: 'home',
        path: '/',
        element: <MapPage />,
    },
    {
        name: 'about',
        path: '/about',
        element: <About />,
    },
    {
        name: 'registration',
        path: '/registration',
        element: <RegistrationPage />,
    },
    {
        name: 'error',
        path: '*',
        element: <Error />,
    }
];
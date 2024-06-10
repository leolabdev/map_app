import About from '../../pages/About';
import Error from '../../pages/Error';
import MapPage from '../../pages/MapPage';
import RegistrationPage from '../../pages/RegistrationPage';
import {AppRoutesLinks} from "./AppRoutesLinks";
import {RoutePaths} from "./RoutePaths";


export const routeConfig = Object.values({
    [AppRoutesLinks.HOME]: {
        path: RoutePaths.home,
        element: <MapPage />,
    },
    [AppRoutesLinks.ABOUT]: {
        path: RoutePaths.about,
        element: <About />,
    },
    [AppRoutesLinks.REGISTRATION]: {
        path: RoutePaths.registration,
        element: <RegistrationPage />,
    },
    [AppRoutesLinks.ERROR]: {
        path: "*",
        element: <Error />,
    },
    }
)
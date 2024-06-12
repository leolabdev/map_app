import {Suspense} from 'react'
import {useRoutes} from 'react-router-dom';
import {createRoutesFromConfig} from "./createRoutesFromConfig";
import {routeConfig} from "./routeConfig";

const AppRouter = () => {
    const elements = useRoutes(createRoutesFromConfig(routeConfig));
    return (
        <Suspense fallback={"...loading"}>
            <div className="page-wrapper">{elements}</div>
        </Suspense>
    );
};


export default AppRouter
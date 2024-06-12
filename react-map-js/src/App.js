import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/UI/Navbar/Navbar';
import './App.css'
import { CssBaseline } from '@material-ui/core';
import AppRouter from "./shared/router/AppRouter";

const App = () => {
    return (
        <BrowserRouter>
            <CssBaseline />
            <Navbar />
            <AppRouter />
        </BrowserRouter>
    )

}

export default App
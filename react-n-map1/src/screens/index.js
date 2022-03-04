import About from "./about";
import { Counter } from './counter';
import { OS } from "./os";
import { Elements } from "./elements";
import {MapR} from "./mapR"

export const screens = [
    {
        name: 'About',
        component: About
    },

    {
        name: 'Counter',
        component: Counter
    },

    {
        name: 'MapR',
        component: MapR
    },

    {
        name: 'Elements',
        component: Elements
    },

    {
        name: 'OS',
        component: OS
    },

];

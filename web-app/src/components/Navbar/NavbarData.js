import React from 'react';
import {BsFillHouseFill, BsCalendarWeek, BsChatDots, } from 'react-icons/bs';

export const NavbarData = [
    {
        title: 'Dashboard',
        icon: <BsFillHouseFill />,
        to: '/',
    },
    {
        title: 'Calendar',
        icon: <BsCalendarWeek />,
        to: '/calendar',
    },
    {
        title: 'Forum',
        icon: <BsChatDots />,
        to: '/forum',
    },
];
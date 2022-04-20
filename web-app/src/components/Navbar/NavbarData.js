import React from 'react';
import {BsFillFilePersonFill, BsFillHouseFill, BsCalendarWeek, BsChatDots, } from 'react-icons/bs';

export const NavbarData = [
    {
        title: 'Profile',
        icon: <BsFillFilePersonFill />,
        to: '/profile',
    },
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
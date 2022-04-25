import React from 'react';
import {BsFillFilePersonFill, BsFillHouseFill, BsCalendarWeek, BsChatDots, } from 'react-icons/bs';

export const SidebarData = [
    {
        title: 'Profile',
        section: 'profile',
        show: false,
    },
    {
        title: 'Dashboard',
        icon: <BsFillHouseFill />,
        to: '/home',
        section: 'home',
        show: true,
    },
    {
        title: 'Calendar',
        icon: <BsCalendarWeek />,
        to: '/calendar',
        section: 'calendar',
        show: true,
    },
    {
        title: 'Forum',
        icon: <BsChatDots />,
        to: '/forum',
        section: 'forum',
        show: true,
    },
];
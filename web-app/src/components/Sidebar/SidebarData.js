import React from 'react';
import { BsFillHouseFill, BsCalendarWeek, BsChatSquareDots, BsFillQuestionSquareFill, BsCalendarEvent, } from 'react-icons/bs';

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
        icon: <BsChatSquareDots />,
        to: '/forum',
        section: 'forum',
        show: true,
    },
    {
        title: 'Quizzes',
        icon: <BsFillQuestionSquareFill />,
        to: '/quiz',
        section: 'quiz',
        show: true,
    },
    {
        title: 'Events',
        icon: <BsCalendarEvent />,
        to: '/event',
        section: 'event',
        show: true,
    },
];
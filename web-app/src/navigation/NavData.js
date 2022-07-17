import React from 'react';
import {
    BsPerson,
    BsPersonFill,
    
    BsGrid, 
    BsFillGridFill, 
    
    BsCalendarWeek, 
    BsCalendarWeekFill, 

    BsChatSquareDots, 
    BsFillChatSquareDotsFill, 

    BsQuestionSquare, 
    BsQuestionSquareFill, 

    BsCalendarEvent,
    BsCalendarEventFill,

<<<<<<< HEAD
    BsTrophy,
    BsTrophyFill,
=======
    BsAward,
    BsAwardFill,
>>>>>>> 2c85f90faaaedd6b7f1f98f2eab31f947896fdcb
} from 'react-icons/bs';

export const NavData = [
    {
        title: 'Profile',
        icon: <BsPerson />,
        iconActive: <BsPersonFill />,
        to: '/profile',
        section: 'profile',
        show: false,
    },
    {
        title: 'Dashboard',
        icon: <BsGrid />,
        iconActive: <BsFillGridFill />,
        to: '/home',
        section: 'home',
        show: true,
    },
    {
        title: 'Calendar',
        icon: <BsCalendarWeek />,
        iconActive: <BsCalendarWeekFill />,
        to: '/calendar',
        section: 'calendar',
        show: true,
    },
    {
        title: 'Forum',
        icon: <BsChatSquareDots />,
        iconActive: <BsFillChatSquareDotsFill />,
        to: '/forum',
        section: 'forum',
        show: true,
    },
    {
        title: 'Challenges',
        icon: <BsQuestionSquare />,
        iconActive: <BsQuestionSquareFill />,
        to: '/challenges',
        section: 'challenges',
        show: true,
    },
    {
        title: 'Events',
        icon: <BsCalendarEvent />,
        iconActive: <BsCalendarEventFill />,
        to: '/event',
        section: 'event',
        show: true,
    },
    {
        title: 'Rewards',
<<<<<<< HEAD
        icon: <BsTrophy />,
        iconActive: <BsTrophyFill />,
=======
        icon: <BsAward />,
        iconActive: <BsAwardFill />,
>>>>>>> 2c85f90faaaedd6b7f1f98f2eab31f947896fdcb
        to: '/rewards',
        section: 'rewards',
        show: true,
    },
];
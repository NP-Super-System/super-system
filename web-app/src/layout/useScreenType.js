import { useMediaQuery } from 'react-responsive';

export const useScreenType = () => {
    const showSidebar = useMediaQuery({minWidth: 1150});
    const hideSidebar = useMediaQuery({minWidth: 670});

    if(showSidebar) return 'show-sidebar';
    if(hideSidebar) return 'hide-sidebar';
    return 'phone';
}
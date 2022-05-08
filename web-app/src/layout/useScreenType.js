import { useMediaQuery } from 'react-responsive';

export const useScreenType = () => {
    const showSidebar = useMediaQuery({minWidth: 1265});
    // const hideSidebar = useMediaQuery({minWidth: 1265});

    if(showSidebar) return 'show-sidebar';
    return 'hide-sidebar';
}
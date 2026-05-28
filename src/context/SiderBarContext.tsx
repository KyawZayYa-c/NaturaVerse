'use client';
import {createContext, useContext, useState} from "react";

const SidebarContext = createContext({
    isOpen : false,
    toggleSidebar: () => {}
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);
    return (<SidebarContext.Provider value={{isOpen, toggleSidebar}} >
        {children}
    </SidebarContext.Provider> )
}

export const useSideBar = () => useContext(SidebarContext);
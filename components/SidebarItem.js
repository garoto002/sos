"use client";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";


export default function Sidebaritems({ item }) {
    const [open, setOpen] =useState(false);
    return (
        <li className='mb-2 rounded-lg overflow-hidden transition-all duration-200 hover:bg-white/10 backdrop-blur-sm'>
            <div 
              onClick={() => setOpen(!open)}
              className='p-3 flex justify-between items-center cursor-pointer group'
            >
                <span className='flex items-center gap-3 text-blue-100 group-hover:text-white transition-colors'>
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5 text-blue-300 group-hover:text-blue-200" />
                    {item.name}
                </span>
                <FontAwesomeIcon 
                  data-hidden={open}
                  icon={faChevronDown} 
                  className="w-4 h-4 text-blue-300 group-hover:text-blue-200 transition-all data-[hidden=true]:rotate-180" 
                />
            </div>
            <ul 
              data-hidden={open}
              className="hidden data-[hidden=true]:block bg-white/5 overflow-hidden transition-all duration-200"
            >
                {item.SubMenus.map((subMenu, index) => (
                    <li key={index} className="hover:bg-white/10 transition-colors">
                        <Link 
                          href={subMenu.href}
                          className="block pl-11 py-2 text-blue-200 hover:text-white text-sm"
                        >
                          {subMenu.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </li>
    );
}

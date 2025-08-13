"use client";
import { faCalendar, faRightFromBracket, faUser, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";


export default function Navbar (){
    const date = new Date(); 
    const {data: session}= useSession();
    return <nav className="bg-zinc-300 fixed w-[calc(100%-250px)] py-2 px-16 flex justify-between items-center">
        <div>
        <div>
                <p className=" flex gap-1 items-center">
                   <FontAwesomeIcon icon={faCalendar} className="w-5" /> 
                   <span className="font-bold">Data: </span>
                   <span>
                    {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                   </span>
                </p>
            </div>
        </div>
        <div className="flex items-center justify-center gap-4">
            <p className="flex items-center">
                <span className="flex mr-1 bg-zinc-900 rounded-full text-sky-500 w-8 h-8 items-center justify-center">
                    <FontAwesomeIcon icon={session?.user.role == "admin" ? faUserShield : faUser} className="w-5"/>
                   
                </span>
                <Link href={"/users/" + session?.user.email} className="hover:text-sky-500 transition-all hover:translate-y-[2px]">{session?.user.name}</Link>
            </p>
            <button onClick={()=>signOut ()}
             className=" flex items-center justify-center hover:text-sky-500 transition-all hover:translate-y-[2px] gap-1">
                <FontAwesomeIcon icon={faRightFromBracket} className="w-5"/> 
                <span>Sair</span>
            </button>

        </div>
        
    </nav> 
}
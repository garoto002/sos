"use client";
import React from 'react';
import Image from 'next/image';
import { faCartShopping, faUsers, faIdCard, faTruckFast ,faCashRegister,faBoxes,faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SidebarItem from "./SidebarItem";
import { useSession } from 'next-auth/react';

export default function Sidebar() {
  const {data:session} = useSession();
  return (
    <aside className='bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white h-full p-6 w-[280px] fixed shadow-xl transition-all duration-300'>
            <Link href="/" className="block transition-transform hover:scale-105">
                <Image 
                  src="/images/logo-sistema-empresarial.png"
                  width={180} 
                  height={180}
                  className='block mx-auto rounded-lg shadow-lg'
                  alt="Logo Sistema Empresarial"
                />
            </Link>
            <nav className='mt-10'>
              <ul className='space-y-2'>
                {items.map((item, i) => {
                  if (session?.user.role !== "admin" && item.name === "Usuarios") {
                    return null;
                  }
                  return <SidebarItem key={i} item={item} />;
                })}
              </ul>
            </nav>
          </aside>
  );
}
const items = [
    {
      name: "Usuarios",
      icon: faUsers,
      SubMenus: [
        {
          name: "Adicionar usuario",
          href: "/users/create",
        },
        {
          name: "Listar Usuarios",
          href: "/users",
        },
        {
          name: "Estatísticas",
          href: "/users/statistics",
        },
      ],
    },
    {
      name: "Clientes",
      icon: faIdCard,
      SubMenus: [
        {
          name: "Adicionar Clientes",
          href: "/customers/create",
        },
        {
          name: "Listar clientes",
          href: "/customers",
        },
        {
          name: "Estatísticas",
          href: "/customers/statistics",
        },
      ],
    },
    {
      name: "Vendas",
      icon: faCashRegister,
      SubMenus: [
        {
          name: "Nova venda",
          href: "/sales/create",
        },
        {
          name: "Listar vendas",
          href: "/sales",
        },
        {
          name: "Relatórios",
          href: "/sales-report",
        },
        {
          name: "Estatísticas",
          href: "/sales/statistics",
        },
      ],
    },
    {
      name: "Fornecedores",
      icon: faTruckFast,
      SubMenus: [
        {
          name: "Adicionar fornecedor",
          href: "/suppliers/create",
        },
        {
          name: "Listar Fornecedores",
          href: "/suppliers",
        },
        {
          name: "Estatísticas",
          href: "/suppliers/statistics",
        },
      ],
    },
    {
      name: "Compras",
      icon: faShoppingCart,
      SubMenus: [
        {
          name: "Adicionar compras",
          href: "/purchase/create",
        },
        {
          name: "Listar Compras",
          href: "/purchase",
        },
        {
          name: "Relatorios",
          href: "/purchase-report",
        },
      ],
    },
    
  
    {
      
      name: "Produtos",
      icon: faCartShopping,
      SubMenus: [
        {
          name: "Adicionar produto",
          href: "/products/create",
        },
        {
          name: "Listar Produtos",
          href: "/products",
        },
      ],
      
    },
    
    
    /*{
      name: "Stock",
      icon: faBoxes,
      SubMenus: [
        {
          name: "Ajustar Stock",
          href: "/stock-adjustments/create",
        },
        {
          name: "Listar Compras",
          href: "/stock-adjustments",
        },
      ],
    },*/
   
  ];
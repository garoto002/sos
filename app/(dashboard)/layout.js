"use client";
import Header from "@/components/Header";

import { ThemeProvider,createTheme } from "@mui/material";
import { blue, brown, cyan, deepOrange, green, grey, lightBlue } from "@mui/material/colors";

import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900]
    }
  }
}) 
export default function layout({ children }) {
  const {data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading"){
    return (
      <body
      className='flex flex-col items-center h-[100vh] justify-center'
      >
        <FontAwesomeIcon icon={faCircleNotch} 
        className='w-8 h-8 animate-spin'/>
        <p>Verificando se voce esta autenticado</p> 
      </body>
    );
  }else if (status==="authenticated"){
    return (

      <body>
        <ThemeProvider theme={theme}>
          <Header/>
          <main className='mt-16 p-4'>{children}</main>
        </ThemeProvider>
      </body>
  );
  }else {
    return router.push("/auth/login")
  }
 
}

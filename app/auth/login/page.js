import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function page(){
    return (
      <main className="h-[100vh] pt-[10vh]">
            <section className="bg-zinc-900 max-w-sm flex mx-auto rounded-md p-8 items-center flex-col" >
                <Image src="/images/logo-sistema-empresarial.png " 
                width={100}
            height={100}

                />
                <LoginForm></LoginForm>
            </section>


      </main>  
    )
}
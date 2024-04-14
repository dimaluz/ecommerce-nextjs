import { Poppins } from "next/font/google";

import { ThemeSwitcher } from "@/components/global/theme-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ['latin'],
  weight: ['400']
})

export default function Home() {
  return (
    <div>
      <ThemeSwitcher />
      <LoginButton>
        <Button className={cn('text-sm rounded-full', font.className)}>
          Sign In
        </Button>
      </LoginButton>    
    </div>
  );
}

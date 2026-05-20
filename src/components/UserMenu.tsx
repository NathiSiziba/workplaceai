import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";

export function UserMenu() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setAvatar((data.user?.user_metadata?.avatar_url as string) ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setEmail(s?.user?.email ?? null);
      setAvatar((s?.user?.user_metadata?.avatar_url as string) ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!email) {
    return (
      <Button size="sm" variant="outline" onClick={() => router.navigate({ to: "/login" })}>
        Sign in
      </Button>
    );
  }

  const initials = email.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-8 w-8">
            {avatar && <AvatarImage src={avatar} alt={email} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs font-normal">
          <UserIcon className="h-3.5 w-3.5" />
          <span className="truncate">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            router.navigate({ to: "/login" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { SiteHeader } from "@/components/site-header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1">{children}</main>
    </>
  );
}

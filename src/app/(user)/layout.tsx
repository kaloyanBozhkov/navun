import { TopNav } from "@/app/_components/organisms/TopNav";
import { BottomTabBar } from "@/app/_components/organisms/BottomTabBar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      <div className="pb-16 md:pb-0">{children}</div>
      <BottomTabBar />
    </>
  );
}

import { HeaderV2 } from "@/components/v2/HeaderV2";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderV2 />
      <main className="flex flex-1 flex-col bg-paper">{children}</main>
    </>
  );
}

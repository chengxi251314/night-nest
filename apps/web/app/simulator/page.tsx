import Link from "next/link";
import { SimulatorStudio } from "@/components/simulator-studio";

export default function SimulatorPage() {
  return (
    <>
      <div style={{ padding: "24px 24px 0" }}>
        <Link href="/" style={{ color: "#f5f1ff", textDecoration: "none" }}>返回首页</Link>
      </div>
      <SimulatorStudio />
    </>
  );
}

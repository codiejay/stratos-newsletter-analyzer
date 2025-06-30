import EmailHTMLInput from "@/components/Input/EmailHTMLInput";
import MatrixRain from "@/components/MatrixRain";

export default function Home() {
  return (
    <>
      <div className="flex gap-10 justify-center items-center h-screen bg-[black] p-6">
        <div className="w-[600px] h-[70vh]  overflow-hidden bg-black ">
          <MatrixRain />
        </div>
        <EmailHTMLInput />
      </div>
    </>
  );
}

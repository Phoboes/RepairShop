import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-black bg-home-img bg-cover bg-center bg-no-repeat">
      <main className="flex flex-col items-center justify-center max-w-5xl mx-auto h-dvh w-2/4">
        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/80 backdrop-blur-sm text-center flex-col items-center">
          <h1 className="text-4xl font-bold text-white sm:max-w-96 mx-auto sm:text-2xl">
            Welcome to Dan&apos;s repair shop
          </h1>
          <address className="text-white">
            123 Main St, <br />
            Anytown, USA
          </address>
          <p className="text-white">
            We are a local repair shop that specializes in fixing all kinds of
            devices. We are located in Anytown, USA and we are open Monday to
            Friday from 9am to 5pm.
          </p>
          <Button className="w-20 hover:scale-110 transition-all duration-75">
            <Link
              href="tel:555555555555"
              className="text-blue-500 font-bold hover:text-blue-700 transition-all duration-150"
            >
              Call us
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

import logoLogin from "./logoLogin.svg";
import { Button } from "@/components/ui/button";

function Login() {
  return (
    <div className="p-1 w-full h-screen flex justify-center items-center ">
      <div className="w-10/12 h-full bg-gray-100 flex items-center justify-center">
        {/* caja #1 */}
        <div className="hidden bg-gray-300 w-1/2 h-5/6 md:flex items-center justify-center shadow-md">
          <img className="w-72 h-72" src={logoLogin} alt="logoLogin" />
        </div>

        {/* caja #2 */}
        <div className="w-full h-5/6 md:w-1/2 relative flex flex-col justify-center items-center  bg-gray-200  shadow-md">
          <div className="absolute right-0 top-0">
            <Button className="flex justify-end self-end bg-transparent shadow-none rounded-none font-light text-black hover:bg-slate-300 ">
              Registrarse
            </Button>
          </div>
          <div className="h-full w-10/12 sm:w-8/12 md:w-9/12 lg:w-7/12 xl:w-6/12  flex flex-col items-center justify-center">
            <h1 className="mb-2 text-4xl text-center font-bold">
              Inicia sesión
            </h1>
            <span className="mb-6 text-center">
              Ingresa con tu correo y contraseña debajo para iniciar sesión
            </span>
            <form className="w-full flex flex-col items-center justify-center">
              <input
                className="w-full h-12 border border-gray-300 rounded-md px-4 mb-4"
                type="email"
                placeholder="Correo"
              />
              <input
                className="w-full h-12 border border-gray-300 rounded-md px-4"
                type="password"
                placeholder="Contraseña"
              />
              <Button className="mt-6 w-full h-12 bg-white hover:bg-zinc-200 text-zinc-900 dark:bg-black dark:hover:bg-zinc-950 dark:text-zinc-100">
                Continuar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Login };

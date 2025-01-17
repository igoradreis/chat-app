"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { error, login, register } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

   const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      await register();
   };

  return (
    <main className="w-full ">
      <div className="flex flex-col max-w-md p-4 mx-auto text-center text-black bg-white">
        <h1 className="mb-4 text-lg font-bold">Login Page</h1>
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleLogin}
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 text-black bg-white border border-gray-300 outline-none"
            type="text"
            placeholder="Digite seu email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-black bg-white border border-gray-300 outline-none"
            type="password"
            placeholder="Digite sua senha"
          />

          <button
            className="px-4 py-2 font-bold text-white bg-blue-600 max-w-32"
            type="submit"
          >
            Login
          </button>

          <button
            className="px-4 py-2 font-bold text-white bg-green-600 max-w-64"
            type="button"
            onClick={handleRegister}
          >
            Não possui registro?
          </button>

          <p className="text-red-600">{error?.message}</p>
        </form>
      </div>
    </main>
  );
};

export default Page;

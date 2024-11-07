"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Page = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const { registerDB, error } = useAuth()

  const handleRegisterDB = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerDB(name, username, password, password_confirmation);
  };

  return (
    <main className="w-full ">
      <div className="flex flex-col max-w-md p-4 mx-auto text-center text-black bg-white">
        <h1 className="mb-4 text-lg font-bold">Register Page</h1>
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleRegisterDB}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 text-black bg-white border border-gray-300 outline-none"
            type="text"
            placeholder="Digite seu nome"
          />

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
          <input
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full p-2 text-black bg-white border border-gray-300 outline-none"
            type="password"
            placeholder="Confirme sua senha"
          />

          <button
            className="px-4 py-2 font-bold text-white bg-blue-600 max-w-32"
            type="submit"
          >
            Registrar
          </button>

          <p className="text-red-600">{error?.message}</p>
        </form>
      </div>
    </main>
  );
};

export default Page;

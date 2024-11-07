'use client'
import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import socket from '@/lib/socket'
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

const Nav = () => {
  const [users, setUsers] = useState<User[]>([])
  const [usersOnline, setUsersOnline] = useState<User[]>([])
  const {selectedUser, setSelectedUser} = useUser()

  const { user, nav, listDB } = useAuth();

  useEffect(() => {
    //const usersDB = listDB();
    //listDB().then((data) => console.log(data));
    listDB().then((data) => setUsers(data));

    socket.on('users-online', (onlineUsers: User[]) => {
      //setUsers(onlineUsers)
      setUsersOnline(onlineUsers)
      
      //console.log(users)
      //console.log(onlineUsers)
    })    

    return () => {
      socket.off('users-online')
    }
  }, [user])

  // (Object.values(users).length <= 1) ? (<p>No users online</p>) : (Object.values(users).filter((user) => user.name != socket?.auth?.user?.name).map( (user, index) => (
  // className={`h-screen p-2 bg-gray-600 ${user ? "block" : "hidden"}`}
  return (
   user && (<nav className="h-screen p-2 bg-gray-600">
      <ul className="flex flex-col list-none">          
        { (Object.values(users).length <= 1) ? (<p>No users online</p>) : (Object.values(users).filter((u) => u.id != user?.id).map( (usr, index) => (
          <button key={index} onClick={() => setSelectedUser(usr)}>
            <li>
               <UserCard user={usr} status={`${usersOnline.some(r => r.id === usr.id) ? 'online' : 'offline'}`} />
            </li>
          </button>
        )))}
      </ul>
    </nav>)
  );
};

export default Nav;

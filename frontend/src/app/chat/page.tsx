"use client";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

export default function Page() {
  const room = 'general'

  const { user, error, selectDB, insertDB } = useAuth();

  const [messages, setMessages] = useState<Messages[]>([]);
  const [messageContent, setMessageContent] = useState("");

  const { selectedUser } = useUser()

   // if (user && selectedUser) {
   //    // selectDB(user?.id, selectedUser?.id).then( (messages) => Object.values(messages).map( (msg, index) => (
   //    //    setMessages((prev) => [...prev, msg])
   //    // ) ) );
   // }

  useEffect(() => {
    socket.emit("join-room", selectedUser?.id);
    socket.emit("join-room", user?.id)

    if (user && selectedUser) {
       selectDB(user?.id, selectedUser?.id).then( (messages) => setMessages(messages) );
    }
    //console.log(messages)

    //const messagesDB = selectDB(user?.id, selectedUser?.id);
    //setMessages(messagesDB);

    //socket.on("message", (msg) => {
    //  setMessages((prev) => [...prev, msg]);
    //});
    socket.on("message", () => {
      setMessages([])
      if (user && selectedUser) {
         selectDB(user?.id, selectedUser?.id).then( (messages) => setMessages(messages) );
      }
    });

    return () => {
      socket.off("message");
    };
  }, [selectedUser]);

   const handleMessage = async () => {
      await insertDB(user?.id, selectedUser?.id, messageContent);

      if (user && selectedUser) {
         selectDB(user?.id, selectedUser?.id).then( (messages) => setMessages(messages) );
      }
   };

   const sendMessage = () => {
    if (!messageContent.trim()) {
      return;
    }

    let newMessage: Message = {
      to: selectedUser as User,
      sender: user as User,
      content: messageContent,
    };

    socket.emit("message", { to: selectedUser, message: newMessage });

    handleMessage();

    setMessageContent(""); 
   };
  
  const filteredMessages = messages?.filter((message) => (message?.user_from == user?.id && message?.user_to == selectedUser?.id) 
                    || (message?.user_from == selectedUser?.id && message?.user_to == user?.id))

  let userDisplayed = '0';

  return (
   user && selectedUser && (<main className="flex flex-col justify-between bg-[#0a0a0a] min-h-96 min-w-64">
      <div className="flex flex-col w-full p-1">
        {filteredMessages?.map((message, index) => (
          <div key={index} className={`flex flex-row w-full ${message?.user_from === user?.id ? "justify-end" : "justify-start"}`}>
            <div className={`mt-1 ${message?.user_from === user?.id ? "bg-[#008069]" : "bg-gray-600"} rounded-lg w-fit`}>
              <span className="p-2 font-bold text-green-300">
                 {/* {userDisplayed === message?.user_from ? '' : '~ ' + (userDisplayed = message?.user_from)} */}
                 {parseInt(userDisplayed) === message?.user_from ? '' : '~ ' + (
                     user?.id === message?.user_from ? userDisplayed = user?.id + ' ' + user?.name : userDisplayed = selectedUser?.id + ' ' + selectedUser?.name
                  )}
              </span>
              <p className="px-2 mt-2 font-medium text-right text-white rounded-md w-fit">
                {message?.message}
              </p>
            </div>
          </div>
        ))}
      </div>
      <input
        className="p-2 mt-1 text-black bg-gray-200 border border-gray-300 outline-none"
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && sendMessage()}
      />
    </main>)
    
//  const filteredMessages = messages.filter((message) => (message.sender.id == user?.id && message.to.id == selectedUser?.id) 
//    || (message.sender.id == selectedUser?.id && message.to.id == user?.id))

//   return (
//    selectedUser && filteredMessages && (<main className="flex flex-col justify-between bg-[#0a0a0a] min-h-96">
//       <div className="flex flex-col w-full p-1 text-black">
//         {filteredMessages.map((message, index) => (
//           <div key={index} className={`flex flex-row w-full ${message?.sender?.name === user?.name ? "justify-end" : "justify-start"}`}>
//             <div className={`mt-1 ${message?.sender?.name === user?.name ? "bg-[#008069]" : "bg-gray-600"} rounded-lg w-fit`}>
//               <span className="p-2 font-bold text-green-300">
//                 ~ {message.sender.name}
//               </span>
//               <p className="px-2 mt-2 font-medium text-right text-white rounded-md w-fit">
//                 {message?.content}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <input
//         className="p-2 mt-1 text-black bg-gray-200 border border-gray-300 outline-none"
//         type="text"
//         value={messageContent}
//         onChange={(e) => setMessageContent(e.target.value)}
//         onKeyUp={(e) => e.key === "Enter" && sendMessage()}
//       />
//     </main>)

  );
}

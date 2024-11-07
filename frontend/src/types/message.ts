interface Message {
   to: User,
   sender: User,
   content: string
}

interface Messages {
   user_to: number,
   user_from: number,
   message: string
}

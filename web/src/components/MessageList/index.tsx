import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { api } from '../../services/api';
import styles from './styles.module.scss';
import logoImg from '../../assets/logo.svg';


type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}
// Criando lista de mensagens;
const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

// Adiciona cada nova mensagem na fila
socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push( newMessage );
})

export function MessageList() {
  const [ messages, setMessages ] = useState< Message[] >([]);

  // Seta as mensagens da fila para irem aparecendo a cada 3 segundos
  useEffect(() => {
    setInterval(() => {
      if( messagesQueue.length > 0){
        setMessages(prevState =>[
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ].filter( Boolean ))
        messagesQueue.shift();
      }
    }, 2000);
  }, [] )

  useEffect(() => {
    //chamada para api para buscar os dados
    api.get<Message[]>('messages/last3').then((response) => {
      setMessages(response.data)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map(message => {
          return (
            <li  key={message.id} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
               </div>
                <span>{message.user.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  )
}
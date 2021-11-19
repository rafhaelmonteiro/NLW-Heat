import { useContext } from "react"
import { LoginBox } from "./components/LoginBox"
import { MessageList } from "./components/MessageList"
import { SendMessageForm } from "./components/SendMessageForm"
import { AuthContext } from "./contexts/auth"
import styles from "./styles/App.module.scss"

export function App(){
  const {user} = useContext(AuthContext)
  //se o usuário nao estiver vazio retorna SendMessageForm senão loginBox
  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <>
        <MessageList/>
        { !!user ? <SendMessageForm /> : <LoginBox/>}
      </>
    </main>
  )
}



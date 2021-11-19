import { useContext, useState, FormEvent } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../contexts/auth'
import { api } from '../../services/api';
import styles from './styles.module.scss'

export function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  //função de salvar a mensagem no BD
  async function handleSendMessage(event: FormEvent) {
    //prevenir comportamento padrão do submit de direcionar para alguma pagina
    event.preventDefault();
    if (!message.trim()) {
      return;
    }
    await api.post('message', {message})

    setMessage('');
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button onClick={signOut} className={styles.signOutButton}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInformation}> 
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user?.login}
        </span>
      </header>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea 
          name="message" 
          id="message" 
          placeholder="Qual a sua expectativa para o Evento?" 
          onChange={event => setMessage(event.target.value)}//pegar o valor digitado na textArea
          value={message}
          />
        <button type="submit">Enviar Mensagem</button>
      </form>
    </div>
  )
}
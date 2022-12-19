import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Input } from '../style/RiotStyle'
import NavBar from '../components/NavBar'
import Popup from 'reactjs-popup';

import { Client } from '@twilio/conversations'
import flag from '../images/report.png'
import cursorPointer from '../images/cursor-pointer.png'

const ChatInput = styled(Input)`
  font-size: 20px;
  font-weight: none;
  width: 300px;
`

const Chatrooms = styled.div`
  max-width: 25%;
  border-right: 1px solid black;
  /* width: 20%; */
  padding-right: 5px;
`

const Chatroom = styled.div`
  color: #1E2328;
  font-family: inherit;
  text-align: left;
  width: 10vw;
  margin-right: 5px;
  padding: 5px;
  border: 0;
  background: #A09B8C;

  &:hover {
    background: #5B5A56;
  }

  &:focus {
    outline: 0;
  }

  &.selected {
    background: #3C3C41;
  }
`

const Flag = styled.img`
  width: 20px;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    cursor: url(${cursorPointer}), pointer;
  }
`

const FlagTooltipContent = styled(Link)`
  color: red;
  background-color: #1E282D;
  border-radius: 5px;
  padding: 5px;

  &:hover {
    cursor: url(${cursorPointer}), pointer;
  }
`

const Content = styled.div`
  overflow: auto;
  height: auto;
  margin: 5px;
  float: left;
  text-align: left;
  max-width: 75%;
`

const ChatMessage = styled.div`
  font-size: 20px;
`

const Chat = styled.div`
  border: 2px solid black;
  margin: 15px 25vw 15px 25vw;
  width: 50vw;
  display: flex;
  border-radius: 5px;
  position: relative;
  border-color: #C8AA6E;
  background-color: #5B5A56;
`


const ChatPage = () => {
  const [user, setUser] = useState({api: null, chatrooms: []});
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [interacted, setInteracted] = useState(false)
  const bottom = useRef();

  const chatData = {
    user: user,
    selectedChatroom: selectedChatroom,

    selectChatroom: (sid) => {
      user.api.getConversationBySid(sid).then(conv => {
        setSelectedChatroom(conv);
      });
      !interacted && setInteracted(true)
    },
  }

  useEffect(() => {
    bottom.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    const messageAdded = (msg) => {
      setMessages(m => m.concat([msg]));
    };

    if (chatData.selectedChatroom) {
      chatData.selectedChatroom.getMessages().then(msgs => {
        setMessages(msgs.items);
      });
      chatData.selectedChatroom.on('messageAdded', messageAdded);
      return () => {
        chatData.selectedChatroom.off('messageAdded', messageAdded);
      };
    }
  }, [chatData.selectedChatroom]);

  useEffect(() => {
    async function loginChat() {
      const res = await fetch('/api/v1/chat')
      const data = await res.json()

      if (data.error) {
        console.log(data.error)
      } else {
        const client = new Client(data.token)
        client.on('initialized', () => {
          setUser({
            api: client,
            chatrooms: data.chatrooms,
          })
        })
      }
    }

    loginChat()
  }, [])

  const input = useRef();

  useEffect(() => {
    if (chatData.selectedChatroom) {
      input.current.focus();
    }
  }, [chatData.selectedChatroom, input]);

  const onSubmit = ev => {
    if (ev.key !== 'Enter') {
      return;
    }
    chatData.selectedChatroom.sendMessage(input.current.value);
    input.current.value = '';
  }


  function onClickChatroom(ev) {
    chatData.selectChatroom(ev.target.id);
  }

  return (
    <>
      <NavBar/>
      <h1>Chat</h1>
      {chatData.user.username !== null &&
        <Chat>
          <Chatrooms>
            {chatData.user.chatrooms.map(chatroom => {
              let status = 'chatroom';
              if (chatData.selectedChatroom && chatData.selectedChatroom.sid === chatroom[1]) {
                status = ' selected';
              }
              return (
                <Chatroom className={status} key={chatroom[1]} id={chatroom[1]} onClick={onClickChatroom}>
                  {chatroom[0]}
                </Chatroom>
              );
            })}
          </Chatrooms>
          <Content>
            {messages.map(msg =>
              <ChatMessage key={msg.sid}><u>{msg.author}</u>: {msg.body}</ChatMessage>
            )}
            <div ref={bottom} />
          </Content>
          { interacted &&
            <Popup trigger={open => (<Flag src={flag} alt='flag'/>)} position="left center" arrow={false}>
             <FlagTooltipContent>Block and Report</FlagTooltipContent>
            </Popup>
          }
        </Chat>
      }

      { interacted &&
        <ChatInput type="text" ref={input} onKeyUp={onSubmit} placeholder=""/>
      }

    </>
  );
}


export default ChatPage

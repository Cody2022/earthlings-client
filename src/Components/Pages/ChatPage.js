import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useRef } from "react";
import { useEffect, useState } from "react";
import ChatRoom from "../Messenger/ChatRoom";
import Conversation from "../Messenger/Conversation";

const ChatPage = () => {
  const { user, isLoading } = useAuth0();
  const [conversationList, setConversationList] = useState([]);
  const [currentChat, setCurrentChat] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/conversation/${user.email}`);
        setConversationList(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (isLoading === false) {
      getConversations();
    }
    // eslint-disable-next-line
  }, [isLoading]);

  
  console.log(`Current chat is:`, currentChat);
  
  //Fetch messages
  useEffect(() => {
    const getMessages = async () => {
        try {
        const response = await axios.get(`/messages/${currentChat._id}`);
        setMessageList(response.data);
        } catch (err) {
        console.log(err.messge);
      }
    }
    getMessages();
  }, [currentChat._id])

  console.log(`Message list is`, messageList)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chatText = {
      sender: user.email,
      message: newMessage,
      conversationId: currentChat._id
    };

    try {
      const res = await axios.post('/messages/', chatText);
      setMessageList([...messageList, res.data])
      setNewMessage("");
    } catch (err) {
      console.log(err.message)
    }
  };

  //useEffect that will automatically scroll into view
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messageList])
  
  if (isLoading) {
    return <div>isLoading...</div>;
  }
  return (
    <div>
      <h1>This is the official chat messenger page. Coming Soon!!</h1>
      <p>List of conversations:</p>
      <div>
        <input placeholder="Search for friends" />
        {conversationList.map((c) => (
          <div onClick={() => setCurrentChat(c)}>
            <Conversation
              conversation={c}
              currentUser={user}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>
      <div>
        {currentChat ? (
          <div>
            {messageList.map((m) => (
              <div ref={scrollRef}>
                <ChatRoom chatText={m} own={m.sender === user._id} />
              </div>
            ))}
          </div>
        ) : (
          <span style={{ display: "flex", justifyContent: "center" }}>
            Open a conversation to start a chat
          </span>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          placeholder="Write Something"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
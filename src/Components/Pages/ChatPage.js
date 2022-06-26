import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Conversation from "../Messenger/Conversation";

const ChatPage = () => {
  const { user, isLoading } = useAuth0();
  const [conversationList, setConversationList] = useState([]);

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

  if (isLoading) {
    return <div>isLoading...</div>;
  };


  return (
    <div>
      <h1>This is the official chat messenger page. Coming Soon!!</h1>
      <p>Test render:</p>
      <br />
      {conversationList.map((c) => (
        <Conversation conversation={c} currentUser={user} />
      ))}
    </div>
  );
};

export default ChatPage;

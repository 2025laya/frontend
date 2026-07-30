import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook , faComment , faMessage , faPaperPlane , faBookOpen , faBookmark , faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import "./chat.css";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import Text from "./Text"
const socket = io("http://localhost:3000");
export default function Chat({ setpage, state }) {
  const { t } = useTranslation();
  const font = i18n.language === "ar" ? 
  "elmesriRegular, sans-serif" :
   i18n.language==="zh" || i18n.language==="ja" ? "zheng":
    i18n.language==="ko"?"Dongle" :
     "playpen, sans-serif";
  const [message, setmessage] = useState("");
  const [arraymessage, setarrymessage] = useState([]);
  const [username] = useState(`User_${Math.floor(Math.random() * 1000)}`);
  const icons = [
    faBook,
    faComment,
    faMessage,
    faPaperPlane,
    faBookOpen,
    faBookmark,
  ];
  const repeatIcons = Array(47).fill(icons).flat();
  const messageEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setarrymessage((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);
useEffect(() => {
  const container = messageContainerRef.current;

  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}, [arraymessage]);
  
  function sendMessage(e) {
    e.preventDefault();

    if (message.trim() !== "") {
      const messagedata = {
        _id: Date.now() + Math.random(), 
        text: message,
        sender: username,
      };

      socket.emit("sendMessage", messagedata);
      setmessage("");
    }
  }
   function isUserAtBottom() {
  const el = messageContainerRef.current;
  if (!el) return false;

  return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
}
useEffect(() => {
  const container = messageContainerRef.current;

  const shouldScroll = isUserAtBottom();

  if (shouldScroll) {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [arraymessage]);

  async function deleteMessage(id) {
    try {
      await fetch(
        `http://localhost:3000/api/messages/${id}`,
        {
          method: "DELETE",
        }
      );

      setarrymessage((prev) =>
        prev.filter((msg) => msg._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  }
  async function editMessage(id, oldText) {
    const newText = prompt("edit message", oldText);
    if (!newText) return;

    try {
      await fetch(
        `http://localhost:3000/api/messages/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newText }),
        }
      );

      setarrymessage((prev) =>
        prev.map((msg) =>
          msg._id === id
            ? { ...msg, text: newText }
            : msg
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  function go_to_home() {
    setpage("home");
  }
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        background: state
          ? "radial-gradient(circle,#eeaeca 0%, #1D1845 100%)"
          : "radial-gradient(circle,#eeaeca 0%, #94bbe9 100%)",
        backgroundSize: "cover",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "caveatfont",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          boxShadow: "rgb(228, 229, 230) -5px 2px 5px 0px",
          backgroundColor: "#3d393934",
          color: state ? "#e2dfe4" : "#1E1B4B",
          height: "8vh",
          alignItems: "center",
          paddingLeft: "22px",
          transition: "0.3s",
        }}
      >
        <h1 style={{ fontFamily: font }}>
          {t("booksChat")}
        </h1>

        <button
          className="chatbutton"
          onClick={go_to_home}
          style={{
            boxShadow: "-2px -1px 6px 0px",
            marginRight: "22px",
            backgroundColor: "#eeaeca",
            height: "30px",
            border: "none",
            borderRadius: "25px",
            padding: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
            fontFamily: font,
              // transition:"0.2s"
          }}
        >
          {t("buttHome")}
        </button>
      </div>

      <div
      ref={messageContainerRef}
      className="hide-scrollbar"
        style={{
          flex:"1",
          width: "100%",
          height: "100%",
          position: "relative",
          fontFamily:font,
         
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            height: "100%",
            width: "100%",
            justifyContent: "space-around",
            pointerEvents: "none",
            padding: "20px",
            opacity: "1",
            alignContent: "space-around",
            position: "fixed",
            zIndex: "1",
           
          }}
        >
          {repeatIcons.map((icon, index) => (
            <FontAwesomeIcon
              key={index}
              icon={icon}
              style={{
                margin: "25px",
                fontSize: "1.5rem",
                color: "#fff",
                opacity: "0.2",
              }}
              spin
            />
          ))}
        </div>
        {arraymessage.map((msg) => (
          <div
            key={msg._id}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === username
                  ? "flex-end"
                  : "flex-start",
              width: "100%",
              margin: "8px 0",
              zIndex: "1000",
            }}
          >
            <Text>
            <div
              style={{
                backgroundColor:
                  msg.sender === username
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(61,57,57,0.2)",
                width: "fit-content",
                maxWidth: "70%",
                padding: "3px 15px",
                borderRadius: "15px",
                marginRight: "20px",
                marginLeft: "20px",
              }}
            >
                <div style={{display:"flex" , flexDirection:"row-reverse" , justifyContent:"space-between"}}>
                   <h4 style={{ opacity: "0.8", fontWeight: "normal", }}>
                      {msg.sender}
                   </h4>
                   {msg.sender === username && (
                 <div style={{ position: "relative", display: "flex", alignItems: "center", marginRight: "10px", }}>
                   <FontAwesomeIcon icon={faEllipsisVertical} style={{ color: "#1E1B4B", position: "absolute", right: "8px", pointerEvents: "none", zIndex: 2, }}/>
                      <select value="" onChange={(e) => { const action = e.target.value;
                                                          if (action === "edit") {
                                                          editMessage(msg._id, msg.text); }
      if (action === "delete") {
        deleteMessage(msg._id);
      }

      e.target.value = "";
    }}
    style={{
      border: "none",
      background: "transparent",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      cursor: "pointer",
      width: "25px",
      color: "transparent",
      position: "relative",
      zIndex: 1,
      paddingLeft:"25px",
      paddingRight:"15px"
    }}
  >
    <option value="" hidden>
      menu
    </option>

    <option value="edit">
      Edit
    </option>

    <option value="delete">
      Delete
    </option>
  </select>
</div>
              )} 
                </div>
              
              <Text style={{fontSize:"20px"}}>{msg.text}</Text>
            </div>
            </Text>
          </div>
        ))}
      <div ref={messageEndRef} />
      </div>
<Text>
      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "3px",
          // fontFamily: font,
        }}
      >
        
        <input
          name="message"
          placeholder={t("message")}
          value={message}
          onChange={(e) =>
            setmessage(e.target.value)
          }
          style={{
            // fontFamily: font,
            height: "40px",
            width: "95%",
            backgroundColor: "#e2dfe4",
            fontSize: "21px",
            color:
               "#1E1B4B",
          }}
        />
        <button
          className="iconsend"
          style={{
            border: "none",
            background: "none",
            padding: "0",
            color: state
              ? "#e2dfe4"
              : "#1E1B4B",
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
      </Text>
    </div>
  );
}

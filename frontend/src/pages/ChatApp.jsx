import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8001";
const API_BASE = "http://localhost:8001/api";

export default function ChatApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  // In-memory conversations: { [peerId]: Array<{id, fromUserId, toUserId, message, timestamp, clientId?}> }
  const [conversations, setConversations] = useState({});

  const socketRef = useRef(null);
  const currentUserRef = useRef(null);
  const messagesEndRef = useRef(null);
  const seenClientIdsRef = useRef(new Set()); // dedupe echoed messages
  const connectedRef = useRef(false); // avoid double socket setup

  // Keep ref synced to avoid stale closures
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Messages for selected user
  const activeMessages = useMemo(() => {
    if (!selectedUser) return [];
    return conversations[selectedUser._id] || [];
  }, [selectedUser, conversations]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  // Init: fetch me + users, then connect socket and register
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [meRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE}/user/me`, { withCredentials: true }),
          axios.get(`${API_BASE}/user/all`, { withCredentials: true }),
        ]);
        if (!mounted) return;

        const me = meRes.data;
        setCurrentUser(me);
        setAllUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

        if (connectedRef.current) return; // prevent duplicate socket setup
        connectedRef.current = true;

        const s = io(SOCKET_URL, { withCredentials: true });
        socketRef.current = s;

        s.on("connect", () => {
          s.emit("register", String(me._id));
        });

        const onReceive = (payload = {}) => {
          const { fromUserId, toUserId, message, timestamp, clientId } = payload;
          const meNow = currentUserRef.current;
          if (!meNow || !fromUserId || !toUserId || typeof message !== "string") return;

          const myId = String(meNow._id);
          const fromId = String(fromUserId);
          const toId = String(toUserId);

          // Only accept messages involving me
          if (fromId !== myId && toId !== myId) return;

          // Dedupe echo if we already optimistically added this clientId
          if (clientId) {
            if (seenClientIdsRef.current.has(clientId)) return; // already added
            seenClientIdsRef.current.add(clientId);
          }

          const peerId = fromId === myId ? toId : fromId;

          setConversations((prev) => {
            const list = prev[peerId] || [];
            // Also ensure no duplicate id in the same list (extra safety)
            if (clientId && list.some((m) => m.id === clientId)) return prev;

            const msg = {
              id: clientId || `${fromId}-${toId}-${timestamp || Date.now()}-${Math.random()}`,
              fromUserId: fromId,
              toUserId: toId,
              message,
              timestamp: timestamp || Date.now(),
              clientId,
            };
            return { ...prev, [peerId]: [...list, msg] };
          });
        };

        s.on("receive_private_message", onReceive);

        s.on("disconnect", () => {
          // optional: console.log("socket disconnected");
        });

        // Cleanup
        const cleanup = () => {
          s.off("receive_private_message", onReceive);
          s.disconnect();
          socketRef.current = null;
          connectedRef.current = false;
        };

        // Attach cleanup on unmount
        if (!mounted) cleanup();
        else window.addEventListener("beforeunload", cleanup);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    })();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.off("receive_private_message");
        socketRef.current.disconnect();
        socketRef.current = null;
        connectedRef.current = false;
      }
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedUser || !currentUser || !socketRef.current) return;

    const clientId = `client-${Date.now()}-${Math.random()}`;
    // Mark as seen BEFORE optimistic add so echoed copy is ignored
    seenClientIdsRef.current.add(clientId);

    const payload = {
      fromUserId: String(currentUser._id),
      toUserId: String(selectedUser._id),
      message: message.trim(),
      timestamp: Date.now(),
      clientId,
    };

    // Optimistic update for this conversation only
    setConversations((prev) => {
      const list = prev[selectedUser._id] || [];
      // Extra guard: avoid pushing if id somehow exists
      if (list.some((m) => m.id === clientId)) return prev;
      return { ...prev, [selectedUser._id]: [...list, { id: clientId, ...payload }] };
    });

    socketRef.current.emit("private-message", payload);
    setMessage("");
  };

  const formatTime = (ts) => {
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const userDisplay = (u) => u?.name || u?.Email || u?._id || "Unknown";

  return (
    <div className="flex justify-center items-center h-screen mt-5 bg-gray-50">
      <div className="flex h-[80vh] w-[80vw] border rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <h2 className="text-xl font-bold p-4 border-b">Users</h2>
          {allUsers
            .filter((u) => currentUser && u._id !== currentUser._id)
            .map((user) => {
              const isActive = selectedUser?._id === user._id;
              const list = conversations[user._id] || [];
              const last = list[list.length - 1];
              const preview =
                last?.message?.length > 28 ? last.message.slice(0, 28) + "..." : last?.message || "";

              return (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`p-4 cursor-pointer hover:bg-gray-100 border-b ${
                    isActive ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="font-medium">{userDisplay(user)}</div>
                  {last && (
                    <div className="text-xs text-gray-500 flex justify-between mt-1">
                      <span className="truncate max-w-[12rem]">{preview}</span>
                      <span>{formatTime(last.timestamp)}</span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-white">
            {selectedUser ? (
              <div>
                <h3 className="text-lg font-semibold">Chat with {userDisplay(selectedUser)}</h3>
                {selectedUser.Email && (
                  <div className="text-sm text-gray-500">{selectedUser.Email}</div>
                )}
              </div>
            ) : (
              <h3 className="text-lg text-gray-500">Select a user to start chatting</h3>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {selectedUser ? (
              activeMessages.length ? (
                activeMessages.map((msg) => {
                  const isMe = String(msg.fromUserId) === String(currentUser?._id);
                  return (
                    <div key={msg.id} className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] px-3 py-2 rounded-lg shadow ${
                          isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">{msg.message}</div>
                        <div className={`text-[10px] mt-1 ${isMe ? "text-blue-100" : "text-gray-600"}`}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 text-sm">No messages yet. Say hi!</div>
              )
            ) : (
              <div className="text-gray-500 text-sm">Choose a user to view messages</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white flex">
            <input
              className="flex-1 border rounded px-3 py-2 mr-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder={selectedUser ? "Type a message" : "Select a user to start chatting"}
              disabled={!selectedUser}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedUser || !message.trim()}
              className={`px-4 py-2 rounded text-white ${
                !selectedUser || !message.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

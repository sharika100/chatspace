import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import CreateRoomModal from "../components/CreateRoomModal";
import Toast from "../components/Toast";
import { useAuth } from "../context/useAuth";
import {
  DEFAULT_ROOMS,
  subscribeToRooms,
  subscribeToMessages,
  sendMessage,
  createRoom,
  seedDefaultRooms,
} from "../services/chatService";

export default function Chat() {
  const { currentUser, isFirebaseConfigured } = useAuth();

  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState(DEFAULT_ROOMS[0]);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Subscribe to rooms in Firestore
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // Seed default rooms if Firestore is completely empty
    seedDefaultRooms(currentUser);

    const unsubscribe = subscribeToRooms(
      (firestoreRooms) => {
        if (firestoreRooms && firestoreRooms.length > 0) {
          setRooms(firestoreRooms);

          // If selected room is not set or not in list, keep or set to first room
          setSelectedRoom((current) => {
            if (!current) return firestoreRooms[0];
            const match = firestoreRooms.find((r) => r.id === current.id);
            return match || firestoreRooms[0];
          });
        }
      },
      (error) => {
        console.warn("Rooms listener warning:", error.message);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isFirebaseConfigured]);

  // Subscribe to messages in current selected room
  useEffect(() => {
    if (!selectedRoom?.id || !isFirebaseConfigured) {
      return;
    }

    const unsubscribe = subscribeToMessages(
      selectedRoom.id,
      (fetchedMessages) => {
        setMessages(fetchedMessages);
        setMessagesLoading(false);
      },
      (error) => {
        console.error("Messages error:", error);
        setMessagesLoading(false);
        showToast("Error loading messages: " + error.message, "error");
      }
    );

    // Clean up listener when changing rooms or unmounting
    return () => unsubscribe();
  }, [selectedRoom?.id, isFirebaseConfigured, showToast]);

  const handleSelectRoom = (room) => {
    if (room.id !== selectedRoom?.id) {
      setMessages([]);
      setMessagesLoading(true);
      setSelectedRoom(room);
    }
  };

  // Send message handler
  const handleSendMessage = async (text) => {
    if (!selectedRoom?.id) return;

    try {
      await sendMessage(selectedRoom.id, text, currentUser);
    } catch (error) {
      console.error("Error sending message:", error);
      showToast(error.message || "Could not send message.", "error");
      throw error;
    }
  };

  // Create room handler
  const handleCreateRoom = async (name, description) => {
    try {
      const newRoom = await createRoom(name, description, currentUser);
      handleSelectRoom(newRoom);
      showToast(`Room #${newRoom.name} created successfully!`, "success");
    } catch (error) {
      console.error("Error creating room:", error);
      showToast(error.message || "Failed to create room.", "error");
      throw error;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar (Desktop fixed / Mobile drawer) */}
      <Sidebar
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={handleSelectRoom}
        onOpenCreateModal={() => setCreateModalOpen(true)}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Conversation Panel */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <ChatHeader
          selectedRoom={selectedRoom}
          messageCount={messages.length}
          onOpenMobileSidebar={() => setSidebarOpen(true)}
        />

        <MessageList
          messages={messages}
          loading={messagesLoading}
          selectedRoom={selectedRoom}
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!selectedRoom}
          roomName={selectedRoom?.name}
        />
      </main>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />

      {/* Floating Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

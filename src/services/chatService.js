import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";

export const DEFAULT_ROOMS = [
  {
    id: "general",
    name: "General",
    description: "Open community hub for general discussions and greetings.",
    icon: "MessageSquare",
  },
  {
    id: "technology",
    name: "Technology",
    description: "Hardware, AI innovations, devices, and tech industry news.",
    icon: "Cpu",
  },
  {
    id: "programming",
    name: "Programming",
    description: "Code architecture, languages, algorithms, and debugging tips.",
    icon: "Code2",
  },
  {
    id: "web-development",
    name: "Web Development",
    description: "React, Vite, CSS, cloud deployment, and full-stack engineering.",
    icon: "Globe",
  },
  {
    id: "random",
    name: "Random",
    description: "Casual chatter, memes, creative thoughts, and informal talks.",
    icon: "Sparkles",
  },
];

/**
 * Seeds default rooms if the rooms collection is empty
 */
export async function seedDefaultRooms(currentUser) {
  if (!db || !isFirebaseConfigured) return;
  try {
    const roomsRef = collection(db, "rooms");
    const snapshot = await getDocs(roomsRef);
    if (snapshot.empty) {
      console.log("[ChatSpace] Seeding default rooms into Firestore...");
      for (const room of DEFAULT_ROOMS) {
        const roomDoc = doc(db, "rooms", room.id);
        await setDoc(roomDoc, {
          name: room.name,
          description: room.description,
          createdBy: currentUser ? currentUser.uid : "system",
          createdByName: currentUser ? (currentUser.displayName || "Admin") : "System",
          createdAt: serverTimestamp(),
          isDefault: true,
        });
      }
    }
  } catch (error) {
    console.warn("Could not seed default rooms automatically:", error.message);
  }
}

/**
 * Subscribe to real-time updates for chat rooms
 */
export function subscribeToRooms(onSuccess, onError) {
  if (!db || !isFirebaseConfigured) {
    if (onError) onError(new Error("Firebase is not configured."));
    return () => {};
  }

  const roomsRef = collection(db, "rooms");
  // Order rooms alphabetically by name
  const q = query(roomsRef, orderBy("name", "asc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const rooms = [];
      snapshot.forEach((docSnap) => {
        rooms.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
      onSuccess(rooms);
    },
    (error) => {
      console.error("Firestore rooms subscription error:", error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Create a new room with duplicate and validation checks
 */
export async function createRoom(name, description = "", currentUser) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase is not configured. Please verify your .env file.");
  }
  if (!currentUser) {
    throw new Error("You must be logged in to create a room.");
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    throw new Error("Room name must be at least 2 characters long.");
  }
  if (trimmedName.length > 50) {
    throw new Error("Room name cannot exceed 50 characters.");
  }

  const trimmedDesc = description.trim();
  if (trimmedDesc.length > 200) {
    throw new Error("Room description cannot exceed 200 characters.");
  }

  // Check duplicate room name
  const roomsRef = collection(db, "rooms");
  const existingSnapshot = await getDocs(roomsRef);
  const isDuplicate = existingSnapshot.docs.some(
    (d) => d.data().name?.toLowerCase() === trimmedName.toLowerCase()
  );

  if (isDuplicate) {
    throw new Error(`A room named "${trimmedName}" already exists. Please choose a different name.`);
  }

  const newDocRef = await addDoc(roomsRef, {
    name: trimmedName,
    description: trimmedDesc,
    createdBy: currentUser.uid,
    createdByName: currentUser.displayName || currentUser.email.split("@")[0] || "User",
    createdAt: serverTimestamp(),
    isDefault: false,
  });

  return {
    id: newDocRef.id,
    name: trimmedName,
    description: trimmedDesc,
  };
}

/**
 * Subscribe to real-time messages in a specific room
 */
export function subscribeToMessages(roomId, onSuccess, onError) {
  if (!db || !isFirebaseConfigured || !roomId) {
    return () => {};
  }

  const messagesRef = collection(db, "rooms", roomId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const messages = [];
      snapshot.forEach((docSnap) => {
        messages.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
      onSuccess(messages);
    },
    (error) => {
      console.error(`Firestore messages error for room [${roomId}]:`, error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Send a message to a specific room
 */
export async function sendMessage(roomId, text, currentUser) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase is not configured.");
  }
  if (!currentUser) {
    throw new Error("You must be authenticated to send messages.");
  }
  if (!roomId) {
    throw new Error("No room selected.");
  }

  const trimmedText = text.trim();
  if (!trimmedText) {
    throw new Error("Message cannot be empty or only whitespace.");
  }
  if (trimmedText.length > 1000) {
    throw new Error("Message exceeds the maximum limit of 1000 characters.");
  }

  const messagesRef = collection(db, "rooms", roomId, "messages");

  await addDoc(messagesRef, {
    senderId: currentUser.uid,
    senderName: currentUser.displayName || currentUser.email.split("@")[0] || "Anonymous",
    text: trimmedText,
    createdAt: serverTimestamp(),
  });
}

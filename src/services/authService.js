import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "../firebase";

/**
 * Synchronize user profile into Firestore `users/{uid}` collection
 */
export async function syncUserProfile(user, displayName = null) {
  if (!db || !user) return;
  try {
    const userRef = doc(db, "users", user.uid);
    const existing = await getDoc(userRef);

    const profileData = {
      uid: user.uid,
      displayName: displayName || user.displayName || user.email.split("@")[0],
      email: user.email,
      photoURL: user.photoURL || null,
      updatedAt: serverTimestamp(),
    };

    if (!existing.exists()) {
      profileData.createdAt = serverTimestamp();
    }

    await setDoc(userRef, profileData, { merge: true });
  } catch (error) {
    console.error("Error synchronizing user profile in Firestore:", error);
  }
}

/**
 * Register a new user with email, password, and display name
 */
export async function registerWithEmail(email, password, displayName) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured. Please add your credentials to .env.");
  }

  const cleanName = displayName ? displayName.trim() : "";
  if (cleanName.length < 2) {
    throw new Error("Display name must be at least 2 characters long.");
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Set the display name in Firebase Auth
  await updateProfile(user, { displayName: cleanName });

  // Store user document in Firestore
  await syncUserProfile(user, cleanName);

  return user;
}

/**
 * Log in an existing user with email and password
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured. Please add your credentials to .env.");
  }

  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Sync profile document
  await syncUserProfile(user);

  return user;
}

/**
 * Log in using Google Provider
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error("Firebase is not configured. Please add your credentials to .env.");
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Sync profile document
  await syncUserProfile(user);

  return user;
}

/**
 * Sign out the current user
 */
export async function logout() {
  if (!auth) return;
  await signOut(auth);
}

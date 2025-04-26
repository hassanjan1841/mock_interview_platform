"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function signUp(params: SignUpParams) {
  const { uid, email, name } = params;
  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists.",
      };
    }
    await db.collection("users").doc(uid).set({
      email,
      name,
      createdAt: new Date(),
    });
    return {
      success: true,
      message: "User created successfully.",
    };
  } catch (error: any) {
    console.error("Error signing up:", error);
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "The email address is already in use.",
      };
    }
    return {
      success: false,
      message: "An error occurred during sign up.",
    };
    // throw new Error("Sign up failed");
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    await setSessionCookie(idToken);
    return {
      success: true,
      message: "Sign in successful.",
    };
  } catch (error: any) {
    console.error("Error signing in:", error);
    if (error.code === "auth/user-not-found") {
      return {
        success: false,
        message: "User not found.",
      };
    }
    return {
      success: false,
      message: "An error occurred during sign in.",
    };
  }
}

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000;

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK, // 5 days
  });

  cookieStore.set("session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_WEEK,
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    const userData = userRecord.data();
    return {
      id: userRecord.id,
      name: userData?.name,
      email: userData?.email,
    };
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  // If a user object is returned from getCurrentUser(), it means the user is authenticated.
  // The double negation (!!) converts the user object into a boolean value.
  // If user is not null or undefined, it returns true; otherwise, it returns false.
  return !!user;
}

export async function getInterviewByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    const interviewSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    if (interviewSnapshot.empty) {
      return null;
    }

    const interviews = interviewSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return interviews as Interview[];
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
}

export async function getLatestInterview(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  try {
    const { userId, limit = 20 } = params;
    const interviewSnapshot = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .limit(limit)
      .get();

    if (interviewSnapshot.empty) {
      return null;
    }

    const interviews = interviewSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return interviews as Interview[];
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
}

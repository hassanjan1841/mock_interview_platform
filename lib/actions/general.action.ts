import { db } from "@/firebase/admin";

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

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const interview = await db.collection("interviews").doc(id).get();

    return (interview.data() as Interview) || null;
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
}

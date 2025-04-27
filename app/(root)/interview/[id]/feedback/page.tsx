import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";

import React from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export enum FeedbackCategory {
  HighlyRecommended = "Highly Recommended", // Score: 90-100
  Recommended = "Recommended", // Score: 70-89
  Neutral = "Neutral", // Score: 50-69
  NotRecommended = "Not Recommended", // Score: 30-49
  StronglyNotRecommended = "Strongly Not Recommended", // Score: 0-29
}

export const analyzeFeedbackCategory = (score: number): FeedbackCategory => {
  if (score >= 90) return FeedbackCategory.HighlyRecommended;
  if (score >= 70) return FeedbackCategory.Recommended;
  if (score >= 50) return FeedbackCategory.Neutral;
  if (score >= 30) return FeedbackCategory.NotRecommended;
  return FeedbackCategory.StronglyNotRecommended;
};

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const getfeedbackCategory = analyzeFeedbackCategory(
    feedback?.totalScore || 0
  );

  return (
    <div className="section-feedback mt-10 w-full">
      <div>
        <h1 className="text-5xl font-bold text-center max-w-2xl mx-auto">
          Feedback on the interview - {interview?.role}
        </h1>
        <div className="flex flex-row max-sm:flex-col items-center justify-center max-sm:gap-5 gap-10 mt-10">
          <div className="flex items-center">
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 ml-2 text-purple-300"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.253L12 18.897l-7.417 4.626L6 15.27 0 9.423l8.332-1.268z" />
              </svg>{" "}
              Overall Impression: {`${feedback?.totalScore}/100`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-purple-300"
            >
              <path d="M19 3h-1V2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1H10V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3ZM7 2h2v2H7Zm8 0h2v2h-2ZM5 5h14a1 1 0 0 1 1 1v2H4V6a1 1 0 0 1 1-1Zm14 15H5a1 1 0 0 1-1-1V9h16v10a1 1 0 0 1-1 1Z" />
            </svg>
            <span>
              {dayjs
                .unix(feedback?.createdAt._seconds)
                .add(feedback?.createdAt._nanoseconds / 1e6, "milliseconds")
                .format("MMM D, YYYY - h:mm A")}
            </span>
          </div>
        </div>
        <div className="border-b border-gray-800 mt-6 w-full" />
      </div>
      <div className="mt-10 max-w-2xl mx-auto">
        <p className="text-sm">{feedback?.areasForImprovement}</p>
        <h3 className="mt-8">Breakdown of Evaluation:</h3>
        <div>
          <div className="flex flex-col gap-4 mt-4">
            {feedback?.categoryScores.map(({ name, score, comment }, index) => {
              const comments = comment
                .split(".")
                .filter((c) => c.trim() !== "");

              return (
                <div key={name}>
                  <h4>{`${index + 1}. ${name} (${score}/20)`}</h4>
                  <ul className="flex flex-col gap-2 max-w-xl mx-auto">
                    {comments.map((comment, index) => (
                      <li key={index} className="text-sm">
                        {comment}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <div className="mt-10">
              <p className="flex flex-row items-center gap-5">
                <h3 className="max-sm:text-lg">Final Verdict:</h3>
                <span className="rounded-full bg-gray-800 px-4 py-2 text-red-300 max-sm:text-sm text-xl font-bold">
                  {getfeedbackCategory}
                </span>
              </p>
            </div>
            <div className="mt-5">
              <p className="text-sm">{feedback?.finalAssessment}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-5 overflow-hidden mt-10 ">
          <Button
            asChild
            className="flex-1 py-5 text-center text-[#cac5fe] rounded-full border-none bg-gray-800 font-bold"
          >
            <Link href={`/`}>Back to Dashboard</Link>
          </Button>
          <Button
            asChild
            className=" flex-1 py-5 text-center rounded-full border-none bg-[#cac5fe] font-bold"
          >
            <Link href={`/interview/${id}`}>Retake Interview</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;

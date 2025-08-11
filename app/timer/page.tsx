"use client";

import PrimaryLayout from "@/components/layouts/primaryLayout";
import styles from "./page.module.scss";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import moment from "moment";
import { RandomShapeLoading } from "@/components/loading/randomShapeLoading";

export default function TimerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [remainingMinutes, setRemainingMinutes] = useState<number>(0)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)

  useEffect(() => {
    // Get the duration from URL search params
    const duration = searchParams.get('duration');
    
    if (duration) {
      const parsedDuration = parseInt(duration, 10);
      if (!isNaN(parsedDuration) && parsedDuration > 0 && parsedDuration <= 180) {
        setTimerDuration(parsedDuration);
      } else {
        // Invalid duration, redirect back to settings page
        router.push('/');
      }
    } else {
      // No duration provided, redirect back to settings page
      router.push('/');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!timerDuration) return
    let timerEndTime = localStorage?.getItem("endTime")

    if (!timerEndTime) {
        const newTimerEndTime = moment().add(timerDuration, "minutes").valueOf()
        localStorage?.setItem("endTime", newTimerEndTime.toString())
        timerEndTime = newTimerEndTime.toString()
    }

  const interval = setInterval(() => {
    const now = moment().valueOf();
    const endTime = parseInt(timerEndTime);
    const difference = endTime - now;

    if (difference <= 0) {
      clearInterval(interval);
      setRemainingMinutes(0);
      setRemainingSeconds(0);
      return;
    }

    // Calculate total minutes and seconds from the difference
    const totalMinutes = Math.floor(difference / (1000 * 60));
    const totalSeconds = Math.floor(difference / 1000);
    
    // Set the remaining minutes and seconds
    setRemainingMinutes(totalMinutes);
    setRemainingSeconds(totalSeconds % 60);
  }, 1000);

  return () => clearInterval(interval);
}, [timerDuration]);

  // Show loading or redirect if no valid duration
  if (!timerDuration || (!remainingMinutes && !remainingSeconds)) {
    return (
      <PrimaryLayout>
        <div className={styles.timerPage}>
          <RandomShapeLoading />
        </div>
      </PrimaryLayout>
    );
  }

  return (
    <PrimaryLayout>
      <div className={styles.timerPage}>
        <div className={styles.timerPage__timerValuesWrapper}>
            {/* make me a svg */}
            <h1 className={styles.timerPage__timerValue}>{remainingMinutes < 10 ? "0" : ""}{remainingMinutes}</h1>
            <h1 className={styles.timerPage__timerValue}>:</h1>
            <h1 className={styles.timerPage__timerValue}>{remainingSeconds < 10 ? "0" : ""}{remainingSeconds}</h1>
        </div>
        <div onClick={() => {
            localStorage?.removeItem("endTime")
        }}>clear</div>
      </div>
    </PrimaryLayout>
  );
}
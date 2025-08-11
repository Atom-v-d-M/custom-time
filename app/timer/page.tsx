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

  const [timerDone, setTimerDone] = useState<boolean>(false)

  useEffect(() => {
    const existingDuration = localStorage?.getItem("duration")

    if (existingDuration) {
        setTimerDuration(parseInt(existingDuration, 10))
        return
    }

    // Get the duration from URL search params
    const searchParamDuration = searchParams.get('duration');
    
    if (searchParamDuration) {
      const parsedDuration = parseInt(searchParamDuration, 10);

      if (!isNaN(parsedDuration) && parsedDuration > 0 && parsedDuration <= 60) {
        // fix the duration issues for animation. needs to know about active timers
        localStorage?.setItem("duration", parsedDuration?.toString())
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

            if (!totalMinutes && !totalSeconds) {
                localStorage?.removeItem("duration")
                localStorage?.removeItem("endTime")
                setTimerDone(true)
            }

            // Set the remaining minutes and seconds
            setRemainingMinutes(totalMinutes);
            setRemainingSeconds(totalSeconds % 60);
        }, 1000);

        return () => clearInterval(interval);
    }, [timerDuration]);


    const handleStopTimer = () => {
        localStorage?.removeItem("duration")
        localStorage?.removeItem("endTime")
        router.push('/')
    }

    if (timerDone) {
        return (
            <PrimaryLayout>
                <div className={styles.timerPage}>
                    timer done
                </div>
            </PrimaryLayout>
        )
    }

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
            <h1 className={styles.timerPage__timerValue}>{remainingMinutes < 10 ? "0" : ""}{remainingMinutes}</h1>
            <h1 className={styles.timerPage__timerValue}>:</h1>
            <h1 className={styles.timerPage__timerValue}>{remainingSeconds < 10 ? "0" : ""}{remainingSeconds}</h1>
            <svg className={styles.timerPage__durationSvg} width="700" height="700" viewBox="0 0 1002 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background circle - full timer duration */}
                <path 
                    d="M501 15C769.148 15 986.5 232.156 986.5 500C986.5 767.844 769.148 985 501 985C232.852 985 15.5 767.844 15.5 500C15.5 232.156 232.852 15 501 15Z" 
                    stroke="#00FF00"
                    strokeWidth="30" 
                />
                
                {/* Progress circle - remaining time, starts from top */}
                <path 
                    d="M501 15C769.148 15 986.5 232.156 986.5 500C986.5 767.844 769.148 985 501 985C232.852 985 15.5 767.844 15.5 500C15.5 232.156 232.852 15 501 15Z" 
                    stroke="#EF1010" 
                    strokeWidth="30"
                    strokeDasharray="3050"
                    strokeDashoffset={3050 * ((remainingMinutes * 60 + remainingSeconds) / (timerDuration * 60))}
                    transform="rotate(0 501 500)"
                />
            </svg>
        </div>
        <div className={styles.timerPage__clearButton} onClick={handleStopTimer}>clear</div>
      </div>
    </PrimaryLayout>
  );
}
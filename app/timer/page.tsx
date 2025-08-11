"use client";

import PrimaryLayout from "@/components/layouts/primaryLayout";
import styles from "./page.module.scss";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import moment from "moment";
import { RandomShapeLoading } from "@/components/loading/randomShapeLoading";

const bellSound = "/assets/sounds/dingding.wav";

export default function TimerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [remainingMinutes, setRemainingMinutes] = useState<number>(0)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)

  const [audioEnabled, setAudioEnabled] = useState<boolean>(false)
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
                setTimerDone(true);
                clearInterval(interval);
                setRemainingMinutes(0);
                setRemainingSeconds(0);
                localStorage?.removeItem("duration");
                localStorage?.removeItem("endTime");
                const audio = new Audio(bellSound);
                audio.play();
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
        <div className={styles.audioButton} onClick={() => {
            setAudioEnabled(!audioEnabled)
        }}>
            {audioEnabled ? (
                <svg width="45" height="45" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.5556 50V44.1429C34.7222 42.9048 38.0787 40.5238 40.625 37C43.1713 33.4762 44.4444 29.4762 44.4444 25C44.4444 20.5238 43.1713 16.5238 40.625 13C38.0787 9.47619 34.7222 7.09524 30.5556 5.85714V0C36.2963 1.33333 40.9722 4.32143 44.5833 8.96429C48.1944 13.6071 50 18.9524 50 25C50 31.0476 48.1944 36.3929 44.5833 41.0357C40.9722 45.6786 36.2963 48.6667 30.5556 50ZM0 33.6429V16.5H11.1111L25 2.21429V47.9286L11.1111 33.6429H0ZM30.5556 36.5V13.5C32.7315 14.5476 34.4329 16.119 35.6597 18.2143C36.8866 20.3095 37.5 22.5952 37.5 25.0714C37.5 27.5 36.8866 29.75 35.6597 31.8214C34.4329 33.8929 32.7315 35.4524 30.5556 36.5ZM19.4444 16.0714L13.4722 22.2143H5.55556V27.9286H13.4722L19.4444 34.0714V16.0714Z" fill="#E3E3E3"/>
                </svg>
            ) : (
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M46.4646 50L38.8258 42.3611C37.7736 43.0345 36.6582 43.6132 35.4798 44.0972C34.3013 44.5812 33.0808 44.9705 31.8182 45.2651V40.0884C32.4074 39.8779 32.9861 39.6675 33.5543 39.4571C34.1225 39.2466 34.6591 38.9941 35.1641 38.6995L26.7677 30.303V43.4343L14.1414 30.8081H4.0404V15.6566H12.1212L0 3.53535L3.53535 0L50 46.4646L46.4646 50ZM45.9596 35.3535L42.298 31.6919C43.0135 30.3872 43.5501 29.0194 43.9078 27.5884C44.2656 26.1574 44.4444 24.6843 44.4444 23.1692C44.4444 19.213 43.287 15.6776 40.9722 12.5631C38.6574 9.44865 35.6061 7.34428 31.8182 6.25V1.07323C37.037 2.25168 41.2879 4.89268 44.5707 8.99621C47.8535 13.0997 49.4949 17.8241 49.4949 23.1692C49.4949 25.3998 49.1898 27.5463 48.5795 29.6086C47.9693 31.6709 47.096 33.5859 45.9596 35.3535ZM37.5 26.8939L31.8182 21.2121V13.005C33.7963 13.931 35.343 15.3199 36.4583 17.1717C37.5737 19.0236 38.1313 21.0438 38.1313 23.2323C38.1313 23.8636 38.0787 24.4844 37.9735 25.0947C37.8683 25.705 37.7104 26.3047 37.5 26.8939ZM26.7677 16.1616L20.202 9.59596L26.7677 3.0303V16.1616ZM21.7172 31.1869V25.2525L17.1717 20.7071H9.09091V25.7576H16.2879L21.7172 31.1869Z" fill="#FF0000"/>
                </svg>
            )}
        </div>
        <div className={styles.closeButton} onClick={handleStopTimer}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 50L0 45L20 25L0 5L5 0L25 20L45 0L50 5L30 25L50 45L45 50L25 30L5 50Z" fill="#E3E3E3"/>
            </svg>
        </div>
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
      </div>
    </PrimaryLayout>
  );
}
"use client";

import PrimaryLayout from "@/components/layouts/primaryLayout";
import styles from "./page.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TimeSettingsPage() {

  const [timeInputValue, setTimeInputValue] = useState<number | ''>(55)
  const router = useRouter();

  const handleStartTimer = () => {
    if (timeInputValue && typeof timeInputValue === 'number') {
      router.push(`/timer?duration=${timeInputValue}`);
    }
  };
  
  return (
    <PrimaryLayout>
      <div className={styles.timeSettingsPage}>
        <div className={styles.timeSettingsPage__contentContainer}>
            <input 
              type="number" 
              placeholder="00"
              value={timeInputValue}
              min={1}
              max={60}
              onChange={(e) => {
                const value = e.target.value;
                
                // Allow empty value
                if (value === '') {
                  setTimeInputValue('');
                  return;
                }
                
                const numberValue = parseFloat(value);
                
                // Check if it's a valid number and within range
                if (!isNaN(numberValue) && numberValue >= 1 && numberValue <= 60) {
                  setTimeInputValue(numberValue);
                }
              }}  
              className={styles.timeSettingsPage__timerInput}
            />
          <button
            disabled={!timeInputValue}
            className={styles.timeSettingsPage__startTimerButton}
            onClick={handleStartTimer}
          >Start</button>
        </div>
      </div>
    </PrimaryLayout>
  );
}

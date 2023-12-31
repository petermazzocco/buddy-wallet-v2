"use client";
import { useState, useEffect } from "react";

export default function ErrorToast({ message }: { message: string }) {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {showToast && (
        <div className="toast toast-end z-50">
          <div className="alert alert-error">
            <div>
              <span>{message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

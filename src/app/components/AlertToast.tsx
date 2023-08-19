"use client";

import { useState } from "react";

export default function AlertToast({ message }: { message: string }) {
  const [showToast, setShowToast] = useState(true);

  const closeAlert = () => {
    setShowToast(false);
  };
  return (
    <div>
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-info">
            <div>
              <span>{message}</span>
              <button
                className="btn btn-circle btn-outline ml-2"
                onClick={closeAlert}
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

const OfferPopup = () => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[99999]">
      <div className="bg-white p-10 rounded-lg">
        <h1 className="text-xl font-bold">Popup Working ✅</h1>
        <button onClick={() => setShow(false)}>Close</button>
      </div>
    </div>
  );
};

export default OfferPopup;

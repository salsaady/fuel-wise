/**
 * FormCard Component
 *
 * A simple reusable card layout for your forms.
 * It handles the outer styling (background, shadow, spacing),
 * so you can keep each form’s logic in its own component.
 */

import React from "react";

export default function FormCard({ title, children }) {
  return (
    <div className="bg-white mb-14 w-96 p-6 px-10 rounded-lg shadow-lg mx-auto space-y-4">
      {title && <h3 className="mb-7">{title}</h3>}
      {children}
    </div>
  );
}

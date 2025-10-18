"use client";
import React, { forwardRef, useRef } from "react";

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return <input type="text" ref={ref} />;
});

export default function Field() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    if (inputRef.current) {
        console.log(inputRef.current);
        inputRef.current.focus();
    }
  }

  return (
    <>
      <Input ref={inputRef} />
      <button onClick={handleFocus}>입력란 포커스</button>
    </>
  );
}
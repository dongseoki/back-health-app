"use client";
import React, { useRef } from "react";

// function Input({ ref, name, age }: { ref: React.RefObject<HTMLInputElement>, name: string, age: number }) {
//   return <input type="text" ref={ref} />;
// }

function Input({ ref1, name, age }: { ref1: React.RefObject<HTMLInputElement>, name: string, age: number }) {
    return <input type="text" ref={ref1} />;
  }

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
      {/* <Input ref={inputRef} name="길동" age={18} /> */}
      <Input ref1={inputRef} name="길동" age={18} />
      <button onClick={handleFocus}>입력란 포커스</button>
    </>
  );
}
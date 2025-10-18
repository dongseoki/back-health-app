"use client";
import { useRef } from 'react';

function SomeComponent() {
    return (
        <div>
            <h1>Some Component</h1>
        </div>
    );
}

export default function RefTest() {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if (inputRef.current) {
            console.log(inputRef.current);
            inputRef.current.focus();
        }
    };
    return (
        <div>
            <SomeComponent/>
            <h1>Ref Test</h1>
            <input type="text" ref={inputRef} />
            <button onClick={handleClick} >Click</button>
        </div>
    );
}
"use client";
import React,{useState} from "react";

export default function NoHookForm() {
    const [name, setName] = useState("");

    const [errors, setErrors] = useState({
        name: {
            invalid : true,
            message : "이름이 너무 짧아요"
        }
    });

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        console.log(name);
    };
    const handleSubmit = (event : React.SyntheticEvent) => {
        event.preventDefault();
        console.log(name);
        if(name.length < 5){
            setErrors({
                name: {
                    invalid : true,
                    message : "이름이 너무 짧아요 5글자 이상 적어주세요~"
                }
            })
        } else {
            setErrors({
                name: {
                    invalid : false,
                    message : "good"
                }
            })
        }
        console.log("submit");
    };
    return (
        <form>
            <div>
                <h1>No Hook Form Test</h1>
            </div>
            <input
                type="text"
                value={name}
                onChange={handleName}
            />
            {errors.name.invalid && <p>{errors.name.message}</p>}
            <button type="submit" onClick={handleSubmit} >Submit</button>
        </form>
    )
}
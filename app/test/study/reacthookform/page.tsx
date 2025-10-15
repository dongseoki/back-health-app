"use client";
import { useForm } from "react-hook-form";

interface FormData {
    name: string;
}

export default function ReactHookForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        mode: 'onSubmit'
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
        console.log("submit");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h1>React Hook Form Test</h1>
            </div>
            <input
                type="text"
                {...register("name", {
                    required: "이름을 입력해주세요",
                    minLength: {
                        value: 5,
                        message: "이름이 너무 짧아요 5글자 이상 적어주세요~"
                    }
                })}
            />
            {errors.name && <p>{errors.name.message}</p>}
            <button type="submit">Submit</button>
        </form>
    )
}
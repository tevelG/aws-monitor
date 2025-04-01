import { FieldErrors, UseFormRegister } from "react-hook-form"
import { IInputValues } from "./Form"

interface IInput {
    type: keyof IInputValues
    label: string
    register: UseFormRegister<IInputValues>
    errors: FieldErrors<IInputValues>
}

const Input = ({ type, label, register, errors }: IInput) => {

    return (
        <div>
            <label>{label}</label>
            <input {...register(type)} />
            {errors[type] && <p className="error">{errors[type].message}</p>}
        </div>
    )
}

export default Input
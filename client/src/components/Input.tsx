import { FieldErrors, UseFormRegister } from "react-hook-form"
import { IInputValues } from "./Form"

const timeOptions = [
    { label: "Last Hour", value: 60 },
    { label: "Last Day", value: 1440 },
    { label: "Last Week", value: 10080 },
    { label: "Last Month", value: 40320 },
];

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
            {type === 'timePeriod'
                ? <select {...register(type)} defaultValue={60}>
                    {timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                : <input {...register(type)} />}
            {errors[type] && <p className="error">{errors[type].message}</p>}
        </div>
    )
}

export default Input
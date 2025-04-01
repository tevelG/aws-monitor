import { InputValues } from "./InputList"

interface IInput {
    type: keyof InputValues
    label: string
    value: string
    onChange: (type: keyof InputValues, inputValue: string) => void
}

const Input = ({ type, label, value, onChange }: IInput) => {

    return (
        <div>
            <label>{label}</label>
            <input value={value} onChange={(e) => onChange(type, e.target.value)} />
        </div>
    )
}

export default Input
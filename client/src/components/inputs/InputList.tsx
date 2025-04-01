import { useState } from "react"
import Input from "./Input"

export type InputValues = { timePeriod: string, interval: string, ipAddress: string }

const InputList = () => {
    const [inputValues, setInputValues] = useState<InputValues>({ timePeriod: '', interval: '', ipAddress: '' })

    const handleInputChange = (type: keyof InputValues, inputValue: string) => {
        setInputValues(prev => ({...prev, [type]: inputValue}))
    }

    return (
        <div>
            <Input type='timePeriod' label='Time period' value={inputValues.timePeriod} onChange={handleInputChange} />
            <Input type='interval' label='Interval' value={inputValues.interval} onChange={handleInputChange} />
            <Input type='ipAddress' label='IP Address' value={inputValues.ipAddress} onChange={handleInputChange} />
        </div>
    )
}

export default InputList
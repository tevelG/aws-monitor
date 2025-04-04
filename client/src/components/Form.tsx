import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Input from "./Input";

export interface IInputValues {
    ipAddress: string
    timePeriod: number
    interval: number
}

interface IForm {
    onSubmit: (values: IInputValues) => void
}

const ipAddressRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

const schema = yup.object({
    ipAddress: yup
        .string()
        .required("IP Address is required")
        .matches(ipAddressRegex, "Invalid IP address format"),
    timePeriod: yup
        .number()
        .required("Time period is required")
        .typeError("Time period must be a number")
        .positive("Time period must be greater than zero"),
    interval: yup
        .number()
        .required("Interval is required")
        .typeError("Interval must be a number")
        .positive("Interval must be greater than zero")
        .test("is-multiple-of-60", "Interval must be a multiple of 60", (value) => value === undefined ? true : value % 60 === 0),
});

const Form = ({ onSubmit }: IForm) => {

    const { register, handleSubmit, formState: { errors } } = useForm<IInputValues>({
        resolver: yupResolver(schema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">

            <Input type="timePeriod" label="Time Period:" register={register} errors={errors} />
            <Input type="interval" label="Interval:" register={register} errors={errors} />
            <Input type="ipAddress" label="IP Address:" register={register} errors={errors} />

            <button type="submit" className="form__button">Load</button>
        </form>
    );
};

export default Form;

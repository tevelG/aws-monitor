import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Input from "./Input";
import { FetchParams } from "./Layout";

export interface IInputValues {
    ipAddress: string
    timePeriod: number
    interval: number
}

interface IForm {
    setFetchParams: React.Dispatch<React.SetStateAction<FetchParams | null>>
}

const schema = yup.object({
    ipAddress: yup.string().required("IP Address is required"),
    timePeriod: yup
        .number()
        .typeError("Time period must be a number")
        .positive("Time period must be greater than zero")
        .required("Time period is required"),
    interval: yup
        .number()
        .typeError("Interval must be a number")
        .positive("Interval must be greater than zero")
        .required("Interval is required"),
});

const Form = ({ setFetchParams }: IForm) => {

    const { register, handleSubmit, formState: { errors } } = useForm<IInputValues>({
        resolver: yupResolver(schema)
    });

    const onSubmit = (values: IInputValues) => {
        setFetchParams(values)
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <Input type="timePeriod" label="Time Period:" register={register} errors={errors} />
            <Input type="interval" label="Interval:" register={register} errors={errors} />
            <Input type="ipAddress" label="IP Address:" register={register} errors={errors} />

            <button type="submit">Load</button>
        </form>
    );
};

export default Form;

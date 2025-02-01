import { Children, ReactNode } from "react"
import FormFeedback from "./FormFeedback"
import FormInput from "./FormInput"

type Props = {
    name:string
    fields: {
        name: string
        type: string
        id: string
        onChangeFunction: (e:any)=>any
        value: any
    }[]
    submitInput: {
        loading: {
            state: boolean,
            value: string
        },
        defaultValue: string
    }
    feedback: {
        messages: string[]
    }
    onSubmitFunction: (e:any)=>void
    children?: ReactNode
}

const Form = (props: Props) => {

    return (
        <div className='p-3 grid place-items-center rounded-lg h-full'>

            <form onSubmit={props.onSubmitFunction} className='flex flex-col gap-4 w-full py-3'>

                {/* FORM FIELDS */}
                { props.fields.map((field, index) => (
                    <div className='flex gap-1 flex-col bg-blue-900 p-5 rounded-lg' key={index}>
                        <label htmlFor={field.name} className='flex justify-start'>{field.name}: </label>
                        <input 
                            type={field.type} 
                            name={field.name}
                            id={field.id} 
                            onChange={field.onChangeFunction}
                            value={field.value}
                            placeholder="Digite seu email..."
                            className='w-full p-2 rounded-lg outline-none bg-gray-200'/>                
                    </div>
                    ))
                }

                {/* FORM BUTTON */}
                <FormInput
                    type="submit"
                    loading={{
                        state: props.submitInput.loading.state,
                        value: props.submitInput.loading.value
                    }}
                    defaultValue={props.submitInput.defaultValue}
                />

                {props.children}

                {/* FORM FEEDBACK */}
                {props.feedback.messages.length > 0 && 
                    <FormFeedback
                        feedback={props.feedback}
                    />
                }

            </form>

        </div>
    )

}

export default Form
type Props = {
    type: string,
    loading: {
        state: boolean,
        value: string,
    }
    defaultValue: string
}

const FormInput = (props: Props) => {

    return (
        <>
            { !props.loading.state ? (
                <input 
                    type={props.type} 
                    value={props.defaultValue}
                    className='w-1/2 p-4 grid place-items-center text-white font-bold bg-blue-900 hover:bg-blue-950 rounded-lg duration-300 hover:cursor-pointer'
                >
                </input>

            ) : (
                <input 
                    type={props.type} 
                    value={props.loading.value} 
                    disabled
                    className='w-1/2 p-4 grid place-items-center text-white font-bold bg-blue-950 rounded-lg duration-300 hover:cursor-pointer' 
                >
                </input>
                
            )

            }
        </>
    )
}

export default FormInput
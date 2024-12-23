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
                    className='border-2 border-black px-3 py-2 w-2/6 cursor-pointer hover:bg-black hover:text-white duration-200'
                >
                </input>

            ) : (
                <input 
                    type={props.type} 
                    value={props.loading.value} 
                    disabled
                    className='border-2 border-black px-3 py-2 w-2/6 cursor-pointer bg-black text-white' 
                >
                </input>
                
            )

            }
        </>
    )
}

export default FormInput
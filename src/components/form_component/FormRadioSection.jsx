import { useState, useEffect } from "react"
import "./Form.css"

function FormRadioSection( props ) {

    return (
        <>
            <div className="form-section form-radio-section">
                <div className="section-heading">
                    <h2 className="forum-section-header">{ props.sectionTitle }</h2>
                </div>

                <div className="form-radio-buttons">
                    {props.options.map((option) => (
                        <div className="form-radion-button-label" key={ `${option.id}-${option.value}` }>
                            <label htmlFor={ option.id }>{ option.label }</label>
                            <input type="radio" id={ option.id } name={ option.id } value={ option.value } defaultChecked={ option.defaultChecked }/>
                        </div>
                    ))}
                </div>  
            </div>
        </>
    )
}

export default FormRadioSection
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {DropdownButton} from "react-bootstrap";

const SecondPart = ({active, setProgressBar, formData, onChange, title, trip_description, from}) =>{
    if (!active) return null
    return(
        <div className="mainTripInfo mb-5">
            <div className="tripHeader row">
                <div className="col-1 text-center">
                    <h1 className="headerNum">2</h1>
                </div>
                <h1 className="text-left col-11">Fill main information</h1>
            </div>
            <div className="form-group row" style={{width: "60%"}}>
                <label htmlFor="dropdown-basic-button" className="col-sm-3 col-form-label">Trip's type</label>

                <div id="typeInputDiv" className="col-sm-9 row">
                    <h5 className="col-4 border-secondary">{formData.tripType === "" ? "Choose trip location" : formData.tripType}</h5>
                    <DropdownButton variant="light" id="dropdown-basic-button" className="col-1" style={{width: "100%", display: "inline", marginLeft: "10px"}}>
                        <div id="dropdownTypes">
                            <div className="tripTypesDiv">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="tripType"
                                    id="tripType"
                                    spellCheck="false"
                                    value="Mountains"
                                    onChange={(e)=>onChange(e)}
                                />
                                <label htmlFor="tripType">  <i className="fas fa-mountain"/>  Mountains</label>
                            </div>
                            <div className="tripTypesDiv">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="tripType"
                                    id="tripType"
                                    spellCheck="false"
                                    value="Savannah"
                                    onChange={(e)=>onChange(e)}
                                />
                                <label htmlFor="tripType"><i className="fas fa-hippo"/>  Savannah</label>
                            </div>
                            <div className="tripTypesDiv">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="tripType"
                                    id="tripType"
                                    spellCheck="false"
                                    value="Forest"
                                    onChange={(e)=>onChange(e)}
                                />
                                <label htmlFor="tripType"><i className="fas fa-tree"/>  Forest</label>
                            </div>
                            <div className="tripTypesDiv">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="tripType"
                                    id="tripType"
                                    spellCheck="false"
                                    value="Jungle"
                                    onChange={(e)=>onChange(e)}
                                />
                                <label htmlFor="tripType"><i className="fas fa-frog"/>  Jungle</label>
                            </div>
                            <div className="tripTypesDiv">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="tripType"
                                    id="tripType"
                                    spellCheck="false"
                                    value="Seas/Oceans"
                                    onChange={(e)=>onChange(e)}
                                />
                                <label htmlFor="tripType"><i className="fas fa-water"/>  Seas/Oceans</label>
                            </div>
                            <div className="tripTypesDiv">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="tripType"
                                    id="tripType"
                                    spellCheck="false"
                                    value="Arctiс"
                                    onChange={(e)=>onChange(e)}
                                />
                                <label htmlFor="tripType"><i className="far fa-snowflake"/>  Arctiс</label>
                            </div>
                            <div className="tripTypesDiv">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="tripType"
                                    id="tripType"
                                    spellCheck="false"
                                    value="Islands"
                                    onChange={(e)=>onChange(e)}
                                />
                                <label htmlFor="tripType"><i className="fas fa-umbrella-beach"/>  Islands</label>
                            </div>
                            <div className="tripTypesDiv">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="tripType"
                                    id="tripType"
                                    spellCheck="false"
                                    value="Cities"
                                    onChange={(e)=>onChange(e)}
                                />
                                <label htmlFor="tripType"><i className="fas fa-city"/>  Cities</label>
                            </div>
                        </div>
                    </DropdownButton>
                </div>
            </div>
            <div className="form-group row" style={{width: "60%"}}>
                <label htmlFor="title" className="col-sm-3 col-form-label">Trip's title</label>
                <input
                    type="text"
                    className="form-control col-sm-9"
                    name="title"
                    id="title"
                    spellCheck="false"
                    autoComplete="off"
                    value={title}
                    onChange={(e)=>onChange(e)}
                />
            </div>
            <div className="form-group row" style={{width: "60%"}}>
                <label htmlFor="title" className="col-sm-3 col-form-label">Description</label>
                <textarea
                    className="form-control col-sm-9"
                    name="trip_description"
                    spellCheck="false"
                    id="description"
                    value={trip_description}
                    onChange={(e)=>onChange(e)}
                />
            </div>
            <div className="form-group row" style={{width: "60%"}}>
                <label htmlFor="title" className="col-sm-3 col-form-label">Start date</label>
                <input
                    type="date"
                    className="form-control col-sm-9"
                    name="from"
                    id="from"
                    value={from}
                    onChange={(e)=>onChange(e)}
                />
            </div>
            {formData.tripType !== "" && formData.title !== "" && formData.trip_description !== "" && formData.from !== "" && <button
                type="button"
                className="btn-outline-primary"
                onClick={()=>{
                    setProgressBar(50)
                }}>
                Next
            </button>}
        </div>
    )
}

export default connect()(SecondPart)
import React from "react";
import {connect} from "react-redux";

const SecondPart = ({active, setProgressBar, searchTeammates, teammates, displayList, addTeammate, profile, assembledTeammates, removeMember}) =>{
    if (!active) return null
    return(
        <div className="tripTeamDiv">
            <div className="tripHeader row">
                <div className="col-1 text-center">
                    <h5 className="headerNum">2</h5>
                </div>
                <h5 className="text-left col-11">Assemble a team</h5>
            </div>
            <div className="searchTeammateDiv mb-4">
                <input
                    type="text"
                    placeholder="Write name"
                    className="form-control searchTeamInput"
                    onChange={(e)=>searchTeammates(e)}
                />
                {teammates.length > 0 && !displayList && <ul className="searchedTeammateList">
                    {teammates.map((teammate, i)=>{
                        return(
                            <li key={i} className="my-3">
                                <div className="row">
                                    <div className="col-1">
                                        <img alt="" className="rounded-circle" style={{width: "50px", height: "50px"}} src={teammate.imageUrl}/>
                                    </div>
                                    <div className="col-3 ">
                                        <p>{teammate.user.firstname} {teammate.user.secondname}</p>
                                    </div>
                                    <div className="col-2">
                                        <p>{teammate.status ? teammate.status : "No status"}</p>
                                    </div>
                                    <div className="col-2">
                                        {teammate.preferences.length > 0 && <div className="row">
                                            {teammate.preferences.map((preference, i) => {
                                                return(
                                                    <div key={i} className="col-1"><i className={preference.iconClass}/></div>
                                                )
                                            })}
                                        </div>}
                                    </div>
                                    <div className="col-2">
                                        <p>Level: {teammate.level}</p>
                                    </div>
                                    <div className="col-2">
                                        {teammate.status === "ready for trip" || "Set status" ? (
                                            <button type="button" className="btn btn-outline-success" onClick={()=> {
                                                addTeammate(teammate)
                                            }}>Add teammate</button>
                                        ) : (
                                            <button type="button" className="btn btn-outline-secondary">Add teammate</button>
                                        )}
                                    </div>
                                </div>
                                <hr/>
                            </li>
                        )
                    })}
                </ul>
                }
            </div>
            <div className="teammatesHeaderDiv text-center">
                <h3 className="m-0">Trip's members</h3>
            </div>
            <div className="assemblesTeammatesDiv mb-3">
                <div className="row p-3">
                    {profile !== null && <div className="assembledMember col-2 mb-3 text-center">
                        <img
                            className="rounded-circle"
                            alt="" src={profile.imageUrl}
                            style={{width: "100px", height: "100px"}}
                        />
                        <p style={{fontStyle: "italic"}}>Guide</p>
                    </div>}
                    {assembledTeammates.filter(team=>team._id !== profile._id).map((teammate, i)=>{
                        return(
                            <div key={i} className="assembledMember col-2 mb-3 text-center">
                                <img
                                    className="rounded-circle mb-2"
                                    alt="" src={teammate.imageUrl}
                                    style={{width: "100px", height: "100px"}}
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger d-block mx-auto"
                                    onClick={()=>removeMember(teammate, i)}
                                >Remove</button>
                            </div>
                        )
                    })}
                </div>
            </div>
            {assembledTeammates.length>0 && <button
                type="button"
                className="btn-outline-primary btnNextPart"
                onClick={()=>{
                    addTeammate(profile)
                    setProgressBar(66)
                }}>
                Next
            </button>}
        </div>
    )
}

export default connect()(SecondPart)
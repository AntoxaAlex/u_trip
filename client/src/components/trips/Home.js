import React, { Fragment }from 'react';

const Home = () => {
    return (
        <Fragment>
            <div id="findTripBox">
                <form className="form-inline m-auto my-lg-0">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </Fragment>
    );
}

export default Home;
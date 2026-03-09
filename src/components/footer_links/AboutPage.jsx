import { useState, useEffect } from "react";
import "./FooterLinkPages.css";

const AboutUsPage = () => {

    return (
        <>
            <div className="main-content"> { /* you can add more classes or an id but the class must be main-content for spacing */ }
                <h1>Hello!</h1>
                <p>We are a group of Oakland University students with a goal to make a new social media site with a lot of freedom for people to make a community all their own. 
                <br></br>
                • Rory Strachan
                <br></br>
                • Chase Brown
                <br></br>
                • Sean Kehoe
                <br></br>
                • Mohammed Qudaih
                <br></br>
                • Jennifer Orlando
                </p>
            </div>
        </>
    )
}

export default AboutUsPage;
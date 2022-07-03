import React, { Component } from 'react';   
import Header from './header'
import Body from './body/body';
import Footer from './footer';
 
export default function HomePage() {
  return (
    <div>  
        <div id="wrapper">  
            <div id="content-wrapper">  
            <Header />
                <div id="content">  
                    <Body />    
                </div>  
            <Footer/> 
            </div>  
        </div>  
    </div>
  );
}

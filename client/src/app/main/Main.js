import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../../home/Home';
import About from '../../about/About';
import Members from '../../members/Members';
import Listings from '../../listings/Listings';
import SignupSelection from '../../signup-selection/SignupSelection';
import Signup from '../../signup/Signup';
import BusinessSignup from '../../business-signup/BusinessSignup';
import SignIn from '../../signin/SignIn';
import Profile from '../../profile/Profile';
import EditProfile from '../../edit-profile/EditProfile';
import Member from '../../view-member/Member';
import ManageListings from '../../listings/ManageListings';
import Listing from '../../listings/Listing';
import CreateListing from '../../listings/CreateListing';
import BusinessProfile from '../../business-profile/BusinessProfile';
import EditBusinessProfile from '../../edit-profile-business/EditBusinessProfile';
import PrivacyPolicy from '../footer/PrivacyPolicy';
import TermsOfService from '../footer/TermsOfService';
import EditListing from '../../listings/EditListing';
import './Main.css';

// Main component that renders all pages in our app
class Main extends Component {
  render() {
    return (
      <div className='main'>
        <div className='main-background-image'></div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/terms-of-service' component={TermsOfService} />
          <Route exact path='/privacy-policy' component={PrivacyPolicy} />
          <Route exact path='/members' component={Members} />
          <Route exact path='/listings' component={Listings} />
          <Route exact path='/signup-selection' component={SignupSelection} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/business-signup' component={BusinessSignup} />
          <Route exact path='/signin' component={SignIn} />
          <Route exact path='/profile' component={Profile} />
          <Route exact path='/edit-profile' component={EditProfile} />
          <Route exact path='/member/:id' component={Member} />
          <Route exact path='/manage-listings' component={ManageListings} />
          <Route exact path='/create-listing' component={CreateListing} />
          <Route exact path='/listing/:id' component={Listing} />
          <Route exact path='/business-profile' component={BusinessProfile} />
          <Route exact path='/edit-business-profile' component={EditBusinessProfile} />
          <Route exact path='/edit-listing/:id' component={EditListing} />
        </Switch>
      </div>
    );
  }
}

export default Main;

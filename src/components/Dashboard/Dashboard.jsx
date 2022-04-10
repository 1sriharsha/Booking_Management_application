import React, { Component } from "react";
import styles from "./Dashboard.module.css";
import { BookCard, Sidebar, PromotionCard } from "..";
import NavProfile from "../NavProfile/NavProfile";
import Shortcut from "./Shortcut/Shortcut";
import EditCard from "./EditCard/EditCard";
import AddCard from "./AddCard/AddCard";
import Searchbar from "./Searchbar/Searchbar";
import ErrorCard from "./ErrorCard/ErrorCard";
import uniqid from "uniqid";
import axios from "axios";
import { TestPromotionData } from "../../data";
import Visualization from "./Visualization/Visualization";
import MyBookCard from "./MyBookCard/MyBookCard";

const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

var api_url;
if (process.env.NODE_ENV === "production") {
  api_url = REACT_APP_PRODUCTION_URL;
} else {
  api_url = REACT_APP_LOCAL_URL;
}

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Set default tab by user type
    let defaultTab = "Book";
    if (props.userType === "Customer" || props.userType === "Manager") {
      defaultTab = "Dashboard";
    }

    this.state = {
      activeTab: defaultTab,
      searchValue: "",
      sportFilterValue: "",
      facilityData: [],
      myBookData: [],
    };
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  };

  onResetSearch = () => {
    this.setState({ searchValue: "", sportFilterValue: "" });
  };

  handleSearchValue = (value) => {
    this.setState({ searchValue: value });
  };

  handleSportFilter = (value) => {
    this.setState({ sportFilterValue: value });
  };

  componentDidMount() {
    document.body.style.backgroundColor = "var(--color-tertiary)";
    var tempFacData=[]
    // Get Facilities from API
    axios({
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      withCredentials: true,
      url: api_url + "/facilities/",
    })
      .then((res) => {
        if (res.status === 200 || res.status === 304) {
          let counter = 1;

          for (let temp of res.data) {
            const facData = {
              id: counter,
              uniqFacId:temp.facilityId,
              facilityName: temp.facilityName,
              facilityLocation: (
                temp.facilityLocation.city +
                "," +
                temp.facilityLocation.state
              ).trim(),
              facilitySport: temp.facilitySports,
              facilityInfo: temp.facilityInformation,
              availableNow: false,
              reservationPeriodStart: parseInt(temp.reservationPeriodStart),
              reservationPeriodEnd: parseInt(temp.reservationPeriodEnd),
            };
            counter = counter + 1;
            tempFacData.push(facData)
            //console.log(facData)
            
          }
          console.log(tempFacData)
          
          
        }
        this.setState((prevState) => ({
            
          facilityData: tempFacData,
          
        }));
      })
      .catch(function (err) {
        console.log(err);
        if (err.response) {
          if (err.response.status === 404) {
            console.log("Couldn't retrieve facilities");
          }
        } else if (err.request) {
          //Response not received from API
          console.log("Error: ", err.request);
        } else {
          //Unexpected Error
          console.log("Error", err.message);
        }
      });
      
  }

  render() {
    var i = 0;
    var animationDelay = 0;

    // [Guest/Customer/Employee] Generates n BookCard components from Database (filtered by facilityLocation & facilityName)
    const nBookCards = this.state.facilityData
      .filter((facility) => {
        console.log(facility)
        return (
          (facility.facilityLocation
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase()) ||
            facility.facilityName
              .toLowerCase()
              .includes(this.state.searchValue.toLowerCase())) &&
          facility.facilitySport
            .toLowerCase()
            .includes(this.state.sportFilterValue.toLowerCase())
        );
      })
      .map(
        ({
          id,
          uniqFacId,
          facilityName,
          facilityLocation,
          facilitySport,
          facilityInfo,
          availableNow,
          reservationPeriodStart,
          reservationPeriodEnd,
        }) => {
          if (i >= 3) {
            animationDelay += 0.05;
            i = 0;
          }
          i += 1;

          return (
            <React.Fragment>
              <BookCard
                key={uniqid(id, "-bookcard")}
                facilityID={id}
                uniqFacId={uniqFacId}
                facilityName={facilityName}
                facilityLocation={facilityLocation}
                facilitySport={facilitySport}
                facilityInfo={facilityInfo}
                availableNow={availableNow}
                animationDelay={animationDelay}
                reservationPeriodStart={reservationPeriodStart}
                reservationPeriodEnd={reservationPeriodEnd}
                isAuthenticated={this.props.isAuthenticated}
                onShowModal={this.props.onShowModal}
                userFirstName={this.props.userFirstName}
                userLastName={this.props.userLastName}
                userEmail={this.props.userEmail}
              />
            </React.Fragment>
          );
        }
      );

    // [Manager] Generates n EditCard components from Database (filtered by facilityLocation & facilityName)
    const nEditCards = this.state.facilityData
      .filter((facility) => {
        return (
          (facility.facilityLocation
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase()) ||
            facility.facilityName
              .toLowerCase()
              .includes(this.state.searchValue.toLowerCase())) &&
          facility.facilitySport
            .toLowerCase()
            .includes(this.state.sportFilterValue.toLowerCase())
        );
      })
      .map(
        ({
          id,
          uniqFacId,
          facilityName,
          facilityLocation,
          facilitySport,
          facilityInfo,
          availableNow,
          reservationPeriodStart,
          reservationPeriodEnd,
        }) => {
          if (i >= 3) {
            animationDelay += 0.05;
            i = 0;
          }
          i += 1;

          return (
            <React.Fragment>
              <EditCard
                key={uniqid(id, "-editcard")}
                facilityID={id}
                uniqFacId={uniqFacId}
                facilityName={facilityName}
                facilityLocation={facilityLocation}
                facilitySport={facilitySport}
                facilityInfo={facilityInfo}
                availableNow={availableNow}
                animationDelay={animationDelay}
                reservationPeriodStart={reservationPeriodStart}
                reservationPeriodEnd={reservationPeriodEnd}
                isAuthenticated={this.props.isAuthenticated}
                onShowModal={this.props.onShowModal}
              />
            </React.Fragment>
          );
        }
      );

    // [Customer] Generates n PromotionCard components from Database
    const nPromotionCards = TestPromotionData.map(
      ({
        id,
        promotionName,
        promotionCode,
        promotionStart,
        promotionEnd,
        promotionPercentage,
        promotionInfo,
      }) => {
        if (i >= 3) {
          animationDelay += 0.05;
          i = 0;
        }
        i += 1;

        return (
          <React.Fragment>
            <PromotionCard
              key={uniqid(id, "-promotioncard")}
              promotionID={id}
              promotionName={promotionName}
              promotionCode={promotionCode}
              promotionStart={promotionStart}
              promotionEnd={promotionEnd}
              promotionPercentage={promotionPercentage}
              promotionInfo={promotionInfo}
              animationDelay={animationDelay}
            />
          </React.Fragment>
        );
      }
    );

    // [Customer] Generates n MyBookCards components from Database
    const nMyBookCards = this.state.myBookData.map(
      ({ id,uniqFacId, facilityName, facilityLocation, facilitySport, facilityInfo }) => {
        if (i >= 3) {
          animationDelay += 0.05;
          i = 0;
        }
        i += 1;

        return (
          <React.Fragment>
            <MyBookCard
              key={uniqid("", "-mybookcard")}
              facilityID={id}
              uniqFacId={uniqFacId}
              facilityName={facilityName}
              facilityLocation={facilityLocation}
              facilitySport={facilitySport}
              facilityInfo={facilityInfo}
              userFirstName={this.props.userFirstName}
              userLastName={this.props.userLastName}
              userEmail={this.props.userEmail}
            />
          </React.Fragment>
        );
      }
    );

    return (
      <React.Fragment>
        {/* Top Navigation Bar */}
        <header className={styles.topnav}>
          <div className={styles.container}>
            <div className={styles.navigation}>
              {/* Navigation: Search Bar [Middle] */}
              <div className={styles.menu}>
                <div className={styles.search}>
                  <Searchbar
                    userType={this.props.userType}
                    onClickTabItem={this.onClickTabItem}
                    onResetSearch={this.onResetSearch}
                    handleSearchValue={this.handleSearchValue}
                    handleSportFilter={this.handleSportFilter}
                    sportFilterValue={this.state.sportFilterValue}
                    facilityData={this.state.facilityData}
                  />
                </div>
              </div>

              {/* Navigation: User Login/Sign Up Buttons [Right] */}
              <NavProfile
                key={uniqid("", "-navprofile")}
                isAuthenticated={this.props.isAuthenticated}
                userFirstName={this.props.userFirstName}
                userLastName={this.props.userLastName}
                onShowModal={this.props.onShowModal}
                onLogout={this.props.onLogout}
              />
            </div>
          </div>
        </header>

        {/* Side Navigation Bar */}
        <Sidebar
          key={uniqid("", "-sidebar")}
          userType={this.props.userType}
          activeTab={this.state.activeTab}
          onClick={this.onClickTabItem}
        />

        {/* Tab Content */}
        <div className={styles.tabContainer}>
          {/* [Customer] Dashboard Content */}
          {this.state.activeTab === "Dashboard" && (
            <React.Fragment>
              {/* Data Visualization */}
              <section className={styles.dataVisualContainer}>
                <Visualization userType={this.props.userType} />
              </section>

              {/* [Customer] Shortcuts */}
              {this.props.userType === "Customer" && (
                <div className={styles.shortcutContainer}>
                  <Shortcut
                    key={uniqid("", "-shortcut")}
                    shortcutTo="Book"
                    behavior={"switchTab"}
                    title="Book"
                    description="Book A Facility"
                    icon="fa-solid fa-bookmark"
                    iconClass="icon iconBlue"
                    onClick={this.onClickTabItem}
                  />
                  <Shortcut
                    key={uniqid("", "-shortcut")}
                    shortcutTo="My Bookings"
                    behavior={"switchTab"}
                    title="Bookings"
                    description="My Bookings"
                    icon="fa-solid fa-layer-group"
                    iconClass="icon iconPurple"
                    onClick={this.onClickTabItem}
                  />
                  <Shortcut
                    key={uniqid("", "-shortcut")}
                    shortcutTo="Notifications"
                    behavior={"switchTab"}
                    title="Notifications"
                    description="My Notifications"
                    icon="fa-solid fa-bell"
                    iconClass="icon iconOrange"
                    onClick={this.onClickTabItem}
                  />
                </div>
              )}
            </React.Fragment>
          )}
          {/* [Guest/Customer/Employee] Book Content */}
          {this.state.activeTab === "Book" && (
            <div className={styles.bookContainer}>
              {nBookCards && nBookCards}
              {nBookCards.length === 0 && (
                <ErrorCard
                  key={uniqid("", "-errorcard")}
                  userType={this.props.userType}
                  onClickTabItem={this.onClickTabItem}
                />
              )}
            </div>
          )}

          {/* [Guest] My Bookings Content */}
          {this.state.activeTab === "My Bookings" && (
            <div className={styles.bookContainer}>
              {/* TODO Replace with nMyBookCards */}
              <MyBookCard
                key={uniqid("", "-mybookcard")}
                facilityID={0}
                facilityName={"SRSC"}
                facilityLocation={"Bloomington"}
                facilitySport={"Soccer"}
                facilityInfo={"Soccer Field #01"}
                userFirstName={this.props.userFirstName}
                userLastName={this.props.userLastName}
                userEmail={this.props.userEmail}
              />
            </div>
          )}

          {/* [Customer] Notifications */}
          {this.state.activeTab === "Notifications" && (
            <div className={styles.bookContainer}>{nPromotionCards}</div>
          )}

          {/* [Customer] Account */}
          {this.state.activeTab === "Account" && (
            <React.Fragment>
              <section className={styles.settingsImageContainer}>
                154 Reward Points
                <Visualization userType={this.props.userType} />
              </section>
              {/* Interest Shortcut */}
              <div className={styles.shortcutContainer}>
                <Shortcut
                  key={uniqid("", "-shortcut")}
                  shortcutTo="interests"
                  behavior={"showModal"}
                  title="Interests"
                  description="Select Interests"
                  icon="fa-solid fa-medal"
                  iconClass="icon iconOrange"
                  onClick={this.onClickTabItem}
                />
                {/* Payment Shortcut */}
                <Shortcut
                  key={uniqid("", "-shortcut")}
                  shortcutTo="payments"
                  behavior={"showModal"}
                  title="Payments"
                  description="Update Payment"
                  icon="fa-solid fa-credit-card"
                  iconClass="icon iconGreen"
                  onClick={this.onClickTabItem}
                />
              </div>
            </React.Fragment>
          )}

          {/* [Manager] Edit Bookings */}
          {this.state.activeTab === "Edit Facilities" && (
            <div className={styles.bookContainer}>
              <AddCard
                key={uniqid("", "-addcard")}
                type={"facility"}
                animationDelay={animationDelay}
              />
              {nEditCards && nEditCards}
              {nEditCards.length === 0 && (
                <ErrorCard
                  key={uniqid("", "-errorcard")}
                  userType={this.props.userType}
                  onClickTabItem={this.onClickTabItem}
                />
              )}
            </div>
          )}

          {/* [Manager] Edit Equipment */}
          {this.state.activeTab === "Edit Equipment" && (
            <div className={styles.bookContainer}>
              <AddCard
                key={uniqid("", "-addcard")}
                type={"equipment"}
                animationDelay={animationDelay}
              />
            </div>
          )}

          {/* [Manager] Edit Promotions */}
          {this.state.activeTab === "Edit Promotions" && (
            <div className={styles.bookContainer}>
              <AddCard
                key={uniqid("", "-addcard")}
                type={"promotion"}
                animationDelay={animationDelay}
              />
              {nPromotionCards}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;

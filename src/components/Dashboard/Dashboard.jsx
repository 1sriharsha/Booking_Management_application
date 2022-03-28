import React, { Component } from "react";
import styles from "./Dashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BookCard, Sidebar } from "..";
import NavProfile from "../NavProfile/NavProfile";
import Shortcut from "./Shortcut/Shortcut";
import EditCard from "./EditCard/EditCard";
import AddCard from "./AddCard/AddCard";
import Searchbar from "./Searchbar/Searchbar";
import ErrorCard from "./ErrorCard/ErrorCard";
import axios from "axios";

const {
  REACT_APP_LOCAL_URL,
  REACT_APP_PRODUCTION_URL,
  REACT_APP_CLIENT_ID,
  REACT_APP_API_KEY,
} = process.env;

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
    if (props.userType === "Customer") {
      defaultTab = "Dashboard";
    } else if (props.userType === "Manager") {
      defaultTab = "Edit Bookings";
    }

    this.state = {
      activeTab: defaultTab,
      searchValue: "",
      sportFilterValue: "",
      facilityData: [],
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

            this.setState((prevState) => ({
              facilityData: [facData, ...prevState.facilityData],
            }));
          }
        }
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

    // Generates n BookCard components from Database (filtered by facilityLocation & facilityName)
    const nBookCards = this.state.facilityData
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
                key={id}
                facilityID={id}
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

    // Generates n EditCard components from Database (filtered by facilityLocation & facilityName)
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
                key={id}
                facilityID={id}
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
              <section className={styles.dataVisualContainer}></section>

              {/* Shortcuts */}
              <div className={styles.shortcutContainer}>
                <Shortcut
                  shortcutTo="Book"
                  title="Book"
                  description="Book A Facility"
                  icon="fa-solid fa-bookmark"
                  iconClass="icon iconBlue"
                  onClick={this.onClickTabItem}
                />
                <Shortcut
                  shortcutTo="My Bookings"
                  title="Bookings"
                  description="My Bookings"
                  icon="fa-solid fa-layer-group"
                  iconClass="icon iconPurple"
                  onClick={this.onClickTabItem}
                />
                <Shortcut
                  shortcutTo="Notifications"
                  title="Notifications"
                  description="My Notifications"
                  icon="fa-solid fa-bell"
                  iconClass="icon iconOrange"
                  onClick={this.onClickTabItem}
                />
              </div>
            </React.Fragment>
          )}
          {/* [Guest/Customer/Employee] Book Content */}
          {this.state.activeTab === "Book" && (
            <div className={styles.bookContainer}>
              {nBookCards && nBookCards}
              {nBookCards.length === 0 && (
                <ErrorCard
                  userType={this.props.userType}
                  onClickTabItem={this.onClickTabItem}
                />
              )}
            </div>
          )}

          {/* [Manager] Edit Bookings */}
          {this.state.activeTab === "Edit Bookings" && (
            <div className={styles.bookContainer}>
              <AddCard type={"facility"} animationDelay={animationDelay} />
              {nEditCards && nEditCards}
              {nEditCards.length === 0 && (
                <ErrorCard
                  userType={this.props.userType}
                  onClickTabItem={this.onClickTabItem}
                />
              )}
            </div>
          )}

          {/* [Manager] Edit Equipment */}
          {this.state.activeTab === "Edit Equipment" && (
            <div className={styles.bookContainer}>
              <AddCard type={"equipment"} animationDelay={animationDelay} />
            </div>
          )}

          {/* [Manager] Edit Promotions */}
          {this.state.activeTab === "Edit Promotions" && (
            <div className={styles.bookContainer}>
              <AddCard type={"promotion"} animationDelay={animationDelay} />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;

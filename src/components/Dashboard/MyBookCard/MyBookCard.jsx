import React, { Component } from "react";
import styles from "./MyBookCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import axios from "axios";
const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;
class MyBookCard extends Component {
  state = {
    isDeleted: false,
    showModal: false,
  };
  

  onDelete = () => {
    let isExecuted = window.confirm("Are you sure you want to delete this booking ?");
    if(isExecuted){
    var api_url;
    if (process.env.NODE_ENV === "production") {
      api_url = REACT_APP_PRODUCTION_URL;
    } else {
      api_url = REACT_APP_LOCAL_URL;
    }

    axios({
      method:"DELETE",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      withCredentials: true,
      url: api_url + "/book/delete/"+this.props.uniqBookingId,
    }).then((res)=>{
      console.log("Deleted Successfully")
      //Add redirect to Dashboard
    }).catch((err)=>{
      console.log(err)
    })
    this.setState({ isDeleted: true });
  }
  };

  onCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const {
      props: {
        facilityID,
        uniqBookingId,
        gear,
        upgrade,
        intime,
        outtime,
        facilityName,
        facilityLocation,
        facilitySport,
        facilityInfo,
        animationDelay,
      },
    } = this;



    let facilityLabel = facilityName;
    const maxLabelLength = 35;
    if (facilityLabel.length > maxLabelLength) {
      facilityLabel = facilityLabel.substring(0, maxLabelLength) + "...";
    }

    let sportImage =
      "images/" +
      facilitySport.toString().toLowerCase().replace(/ /g, "") +
      ".jpg";
    let fadeDelay = { animationDelay: animationDelay + "s" };

    return (
      <React.Fragment>
        {/* My Bookings Card */}
        {!this.state.isDeleted && (
          <div
            className={[styles.card, styles.loadIn].join(" ")}
            style={fadeDelay}
          >
            <div className={styles.image}>
              <img src={sportImage} alt={facilitySport} />
            </div>
            <div className={styles.content}>
              <div title={facilityName} className={styles.title}>
                {facilityLabel}
              </div>
              <div className={styles.time}>
                <i>
                  <FontAwesomeIcon icon="fa-solid fa-clock" />
                </i>
                Time Slot:{" "}
                <span>
                  {intime}:00 - {outtime}:00
                </span>
              </div>
              <div className={styles.location}>
                <i>
                  <FontAwesomeIcon icon="fa-solid fa-location-arrow" />
                </i>
                {facilityLocation}
              </div>
              <div className={styles.description}>
                <i>
                  <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                </i>
                {facilityInfo}
              </div>

              {/* Cancel Button */}
              <button
                className={[styles.button, styles.cancelButton].join(" ")}
                onClick={this.onDelete}
              >
                Cancel
              </button>

              {/* View Button */}
              <button
                className={[styles.button, styles.buttonPrimary].join(" ")}
                onClick={() => this.setState({ showModal: true })}
              >
                View
              </button>
            </div>
          </div>
        )}
        {this.state.showModal && (
          <ConfirmationModal
            qrValue={uniqBookingId}
            onCloseModal={this.onCloseModal}
            facilityName={facilityName}
            facilityLocation={facilityLocation}
            facilitySport={facilitySport}
            facilityInfo={facilityInfo}
          />
        )}
      </React.Fragment>
    );
  }
}

export default MyBookCard;
